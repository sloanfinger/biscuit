import { env } from "@/env";
import { MongoClient, ObjectId } from "mongodb";
import { unstable_after as after } from "next/server";
import * as z from "zod";

export const User = z.object({
  _id: z.instanceof(ObjectId),
  password: z.string(),
  verification: z.literal(true).or(z.string()),
  /**
    WARNING: This object will be signed into a JWT and stored as a cookie, which limits its size. 
    @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage
  */
  profile: z.object({
    email: z.string().email(),
    username: z.string().min(4),
  }),
});

type Infer<T extends z.ZodType> = Omit<z.infer<T>, "_id">;

export interface Collections {
  users: Infer<typeof User>;
}

/**
 * Creates a new connection to the MongoDB server. This utility uses `unstable_after()` to close the database connection automatically.
 * @param callback Runs after the client successfully connects to the database. After the callback finishes, the connection is closed before the returned promise resolves.
 * @returns A promise. Resolves to the return value of the callback. Rejects if an error is thrown.
 */
export default async function connect() {
  const client = new MongoClient(env.MONGO_URI);
  const db = client.db(env.DB_NAME);
  const cleanupTasks: (() => Promise<unknown>)[] = [];

  after(async () => {
    await Promise.allSettled(cleanupTasks.map((task) => task()));
    await client.close();
  });

  await client.connect().catch((error: unknown) => {
    console.error(error);
    throw new Error("Unable to connect to database.");
  });

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
