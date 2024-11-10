import { env } from "@/env";
import { MongoClient } from "mongodb";
import type * as z from "zod";
import * as CollectionSchemas from "./collections";

const client =
  "__mongo_client" in globalThis
    ? (globalThis as unknown as { __mongo_client: MongoClient }).__mongo_client
    : new MongoClient(env.MONGO_URI);

if (env.NODE_ENV === "development") {
  (globalThis as unknown as { __mongo_client?: MongoClient }).__mongo_client =
    client;
}

const db = client.db(env.DB_NAME);
const connection = client.connect().catch((error: unknown) => {
  console.error(error);
  throw new Error("Unable to connect to database.");
});

/**
 * Creates a new connection to the MongoDB server.
 * @param callback Runs after the client successfully connects to the database. After the callback finishes, the connection is closed before the returned promise resolves.
 * @returns A promise which resolves to a set of utilities for interacting with the database, once the connection is made.
 */
export default async function connect() {
  await connection;
  return {
    /**
     * A utility for accessing or operating on documents within a specified collection.
     * @param name The name of a document collection.
     * @returns A typed reference to the document collection.
     */
    from: <K extends keyof Collections>(name: K) =>
      db.collection<Collections[K]>(name, {}),
  };
}

export type Connection = ReturnType<typeof connect>;

export type Collections = {
  [K in keyof typeof CollectionSchemas]: Omit<
    z.infer<(typeof CollectionSchemas)[K]>,
    "_id"
  >;
};

export const Schema = CollectionSchemas;
