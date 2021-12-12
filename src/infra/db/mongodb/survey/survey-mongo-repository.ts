import { Collection } from 'mongodb';
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurveyRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('surveys');
  }

  async add(surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await this.getCollection();
    await accountCollection.insertOne(surveyData);
  }
}
