import { Collection, ObjectId } from 'mongodb';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('surveyResults');
  }

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await this.getCollection();
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(surveyData.surveyId),
        accountId: new ObjectId(surveyData.accountId),
      },
      {
        $set: {
          answer: surveyData.answer,
          date: surveyData.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    return this.loadBySurveyId(surveyData.surveyId);
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await this.getCollection();
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId),
      })
      // Saves the total survey results in a field (count)
      // to use later in the percentage count.
      .group({
        // Groups input documents by the specified _id,
        // in this case the $group stage
        // calculates accumulated values for all the input documents.
        _id: null,
        // Save all fields of the document in an array (data).
        // $$ROOT references the root document, i.e. the top-level document,
        // currently being processed in the aggregation pipeline stage.
        data: { $push: '$$ROOT' },
        // This sums up one for each record found,
        // using the $sum accumulator operator.
        count: { $sum: 1 },
      })
      // $unwind deconstructs an array field from the input documents
      // to output a document for each element.
      .unwind('$data')
      // $lookup performs a left outer join to a collection in the same database.
      .lookup({
        from: 'surveys',
        localField: 'data.surveyId',
        foreignField: '_id',
        as: 'survey',
      })
      .unwind('$survey')
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            // Selects a subset of an array to return based on the specified condition.
            // Returns an array with only those elements that match the condition.
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer'],
              },
            },
          },
        },
        count: { $sum: 1 },
      })
      .unwind('$_id.answer')
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            { $divide: ['$count', '$_id.total'] },
            100,
          ],
        },
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
        },
        answers: {
          $push: '$_id.answer',
        },
      })
      // $project passes along the documents with the requested fields
      // to the next stage in the pipeline.
      .project({
        _id: null,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();
    const [surveyResult] = await surveyResultCollection
      .aggregate(query)
      .toArray();
    return <SurveyResultModel>MongoHelper.map(surveyResult);
  }
}
