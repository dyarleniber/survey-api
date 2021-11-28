import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: <MongoClient><unknown>null,

  async connect(uri: string): Promise<void> {
    this.client = new MongoClient(uri);
    await this.client.connect();
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = <MongoClient><unknown>null;
  },

  getCollection(name: string): Collection {
    const db = this.client.db();
    return db.collection(name);
  },

  map: (data: any): any => {
    const { _id, ...rest } = data;
    return { ...rest, id: _id?.toHexString() };
  },
};
