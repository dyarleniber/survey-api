import { Collection, ObjectId } from 'mongodb';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository';
import { SaveSurveyResultModel } from '@/domain/use-cases/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('surveyResults');
  }

  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await this.getCollection();
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
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
    return <SurveyResultModel>MongoHelper.map(surveyResult);
  }
}
