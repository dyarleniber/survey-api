import { QueryBuilder } from '@/infra/db/mongodb/helpers';

const makeSut = () => new QueryBuilder();

describe('Query builder', () => {
  test('Should build a query with all stages', () => {
    const sut = makeSut();
    const match = { any_field: 'any_value' };
    const group = {
      _id: '$any_field',
      count: { $sum: 1 },
    };
    const lookup = {
      from: 'any_collection',
      localField: 'any_field',
      foreignField: 'any_field',
      as: 'any_collection',
    };
    const unwind = '$any_field';
    const addFields = { field: '$any_field' };
    const project = { field: 1, any_field: '$any_value' };
    const sort = { field: 1 };
    const query = sut
      .match(match)
      .group(group)
      .lookup(lookup)
      .unwind(unwind)
      .addFields(addFields)
      .project(project)
      .sort(sort)
      .build();
    expect(query).toBeTruthy();
    expect(query.sort()).toEqual([
      { $match: match },
      { $group: group },
      { $lookup: lookup },
      { $unwind: unwind },
      { $addFields: addFields },
      { $project: project },
      { $sort: sort },
    ].sort());
  });
});
