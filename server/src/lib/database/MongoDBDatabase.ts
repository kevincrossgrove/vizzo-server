import { MongoClient, ObjectId, Db } from 'mongodb';

interface DefaultFields {
  Created: string;
  LastUpdated: string;
  _id: string;
}

// TODO: Type query objects in class functions
class MongoDBDatabase {
  client: MongoClient;
  databaseName: string;
  database: Db | null;
  options: object = {
    // projection: { id: "$_id" }, Doing this doesn't get any other field into the record just the id.
  };

  /**
   * Manages reading, adding, and updating in Mongo DB
   */
  constructor(client: MongoClient, dbName: string) {
    this.client = client;
    this.databaseName = dbName;
    this.database = null;
  }

  setDataSource(db: Db) {
    this.database = db;
  }

  getDataSource() {
    return this.database;
  }

  /**
   *  Connect to the MongoClient using the database name
   */
  async init() {
    this.client.on('serverOpening', () => {
      console.log(`MongoDB Connected to ${this.databaseName}`);
    });

    this.client.on('serverClosed', () => {
      console.log(`MongoDB Disconnected from ${this.databaseName}`);
    });

    await this.client.connect();

    this.setDataSource(this.client.db(this.databaseName));
  }

  /**
   * Disconnect from the MongoClient connection
   */
  async close() {
    const database = this.databaseName;
    console.log(`Attempting to close MongoDB connection to ${database}`);

    if (!this.client) return;

    try {
      await this.client.close();

      console.log(`Connection to MongoDB ${database} Closed`);
    } catch {
      console.log(`Failed to close MongoDB connection to ${database}`);
    }
  }

  /**
   * Attempts to get collection using the current DB.
   */
  getCollection(collectionName: string) {
    if (!this.database) return null;

    return this.database.collection(collectionName);
  }

  /**
   * Attempts to find documents in a collection using a query
   */
  async find<T extends DefaultFields>(
    collectionName: string,
    query: any = {},
    options: any = this.options
  ) {
    const collection = this.getCollection(collectionName);

    if (!collection) return [];

    let out: Array<T> = await collection.find<T>(query, options).toArray();

    return out || [];
  }

  /**
   * Gets all the documents from a collection
   */
  async getAll<T extends DefaultFields>(
    collectionName: string,
    options: any = this.options
  ) {
    return this.find<T>(collectionName, null, options);
  }

  /**
   * Finds all objects from a collection matching a query
   */
  async findAllWhere<T extends DefaultFields>(
    collectionName: string,
    query: any,
    options: any = this.options
  ) {
    let out: T[] = [];

    if (!query) return out;

    return this.find<T>(collectionName, query, options);
  }

  /**
   * Finds one object from a collection
   */
  async findOneWhere<T extends DefaultFields>(
    collectionName: string,
    query: any,
    options: object = this.options
  ) {
    const collection = this.getCollection(collectionName);

    if (!collection) return null;

    let out = await collection.findOne<T>(query, options);

    return out || null;
  }

  /**
   * Gets the latest document created
   */
  async findLatestCreated<T extends DefaultFields>(
    collection: any
  ): Promise<T | null> {
    let out = this.findOneWhere<T>(collection, {}, { sort: { Created: -1 } });

    return out !== null ? out : null;
  }

  /**
   * Adds an item to a collection
   */
  async addItem<T extends DefaultFields>(
    collectionName: string,
    item: any = {}
  ) {
    console.log('Adding an item to the database');

    const collection = this.getCollection(collectionName);

    if (!collection) return null;

    const result = await collection.insertOne(item);

    if (result.insertedId) {
      return this.getByID<T>(collectionName, result.insertedId.toString());
    }

    return null;
  }

  /**
   * Updates an item in the collection by id.
   */
  async updateItem() {}

  /**
   * Deletes an item from the collection by id.
   */
  async deleteItem(collectionName: string, itemId: string) {
    console.log(`Deleting an item in the database ${this.databaseName}`);

    const collection = this.getCollection(collectionName);

    if (!collection) return false;

    const result = await collection.deleteOne({ _id: new ObjectId(itemId) });

    return !!result.deletedCount;
  }

  /**
   * Gets an item from a collection by id.
   */
  async getByID<Type extends DefaultFields>(
    collectionName: string,
    itemId: string,
    options: any = this.options
  ) {
    console.log(
      'Getting an item from the database: ' + this.databaseName + '-',
      collectionName
    );

    if (!itemId) return null;

    try {
      const result = await this.findOneWhere<Type>(
        collectionName,
        { _id: new ObjectId(itemId) },
        options
      );

      return result;
    } catch (e: any) {
      console.log(e);
      console.log(
        `Error fetching document by ID in ${this.databaseName}-${collectionName}`
      );

      return null;
    }
  }

  /**
   * Used to drop a collection in the database
   */
  async dropCollection(collectionName: string) {
    const collection = this.getCollection(collectionName);

    if (!collection) return null;

    return collection.drop();
  }

  /**
   * To perform a bulk operation
   */
  async bulkOperation(
    collectionName: string,
    data: Array<any>,
    ordered: boolean = false
  ) {
    const collection = this.getCollection(collectionName);

    if (!collection) return null;

    return collection.bulkWrite(data, { ordered });
  }
}

export default MongoDBDatabase;
