import { Collection, ObjectId } from 'mongodb';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('surveyResults');
  }

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await this.getCollection();
    const { value: surveyResult } = await surveyResultCollection.findOneAndUpdate(
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
