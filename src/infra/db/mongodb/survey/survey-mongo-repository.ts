import { Collection, ObjectId } from 'mongodb';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { AddSurveyParams } from '@/domain/use-cases/survey/add-survey';
import { SurveyModel } from '@/domain/models/survey';
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers';

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('surveys');
  }

  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await this.getCollection();
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await this.getCollection();
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)],
                },
              },
            },
          }, 1],
        },
      })
      .build();
    const surveys = await surveyCollection.aggregate(query).toArray();
    return <SurveyModel[]>MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<SurveyModel | null> {
    const surveyCollection = await this.getCollection();
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    return survey && <SurveyModel>MongoHelper.map(survey);
  }
}
