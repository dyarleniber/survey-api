import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: <MongoClient><unknown>null,
  url: <string><unknown>null,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = new MongoClient(url);
    await this.client.connect();
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = <MongoClient><unknown>null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url);
    }
    const db = this.client.db();
    return db.collection(name);
  },

  map: (data: any): any => {
    const { _id: id, ...rest } = data;
    return { ...rest, id: id?.toHexString() };
  },

  mapCollection: (collection: any[]): any[] => collection.map((c) => MongoHelper.map(c)),
};
