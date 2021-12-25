import { Collection, ObjectId } from 'mongodb';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { AddSurveyModel } from '@/domain/use-cases/survey/add-survey';
import { SurveyModel } from '@/domain/models/survey';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository {
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

  async loadById(id: string): Promise<SurveyModel | null> {
    const surveyCollection = await this.getCollection();
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    return survey && <SurveyModel>MongoHelper.map(survey);
  }
}
