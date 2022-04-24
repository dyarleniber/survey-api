export class QueryBuilder {
  private readonly query: Object[] = [];

  match(data: Object): QueryBuilder {
    this.query.push({ $match: data });
    return this;
  }

  group(data: Object): QueryBuilder {
    this.query.push({ $group: data });
    return this;
  }

  lookup(data: Object): QueryBuilder {
    this.query.push({ $lookup: data });
    return this;
  }

  unwind(data: string): QueryBuilder {
    this.query.push({ $unwind: data });
    return this;
  }

  addFields(data: Object): QueryBuilder {
    this.query.push({ $addFields: data });
    return this;
  }

  project(data: Object): QueryBuilder {
    this.query.push({ $project: data });
    return this;
  }

  build(): Object[] {
    return this.query;
  }
}
