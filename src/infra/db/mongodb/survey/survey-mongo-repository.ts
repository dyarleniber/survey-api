import { Collection } from 'mongodb';
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey';
import { SurveyModel } from '../../../../domain/models/survey';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('surveys');
  }

  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.getCollection();
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await this.getCollection();
    const surveys = await surveyCollection.find({}).toArray();
    return <SurveyModel[]>MongoHelper.mapCollection(surveys);
  }
}
