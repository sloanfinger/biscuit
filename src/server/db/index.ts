import { env } from "@/env";
import { MongoClient } from "mongodb";
import { unstable_after as after } from "next/server";
import * as CollectionSchemas from "./collections";
import type * as z from "zod";

const client = new MongoClient(env.MONGO_URI);
const db = client.db(env.DB_NAME);
const cleanupTasks: (() => Promise<unknown>)[] = [];
const connection = client
  .connect()
  .then(() => {
    after(async () => {
      await Promise.allSettled(cleanupTasks.map((task) => task()));
      await client.close();
    });
  })
  .catch((error: unknown) => {
    console.error(error);
    throw new Error("Unable to connect to database.");
  });

/**
 * Creates a new connection to the MongoDB server. This utility uses `unstable_after()` to close the database connection automatically.
 * @param callback Runs after the client successfully connects to the database. After the callback finishes, the connection is closed before the returned promise resolves.
 * @returns A promise. Resolves to the return value of the callback. Rejects if an error is thrown.
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
    /**
     * Queue a task to execute **after** the server has responded to the user but **before** the database connection is closed. There is no guarantee of the order in which tasks will execute.
     * @param task The task to execute.
     */
    after: (task: () => Promise<unknown>) => {
      cleanupTasks.push(task);
    },
  };
}

export type Collections = {
  [K in keyof typeof CollectionSchemas]: Omit<
    z.infer<(typeof CollectionSchemas)[K]>,
    "_id"
  >;
};

export const Schema = CollectionSchemas;
