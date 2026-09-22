import { MongoClient, type Db } from "mongodb";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (process.env.NODE_ENV === "development") {
    global._mongoClientPromise ??= new MongoClient(uri, options).connect();
    return global._mongoClientPromise;
  }

  return new MongoClient(uri, options).connect();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "bikereg");
}
