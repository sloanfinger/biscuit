import { env } from "@/env";
import mongoose, { Model, model } from "mongoose";

function connect() {
  const promise = mongoose
    .connect(env.MONGO_URI, { dbName: env.DB_NAME })
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("Unable to connect to database.");
    });

  (
    globalThis as unknown as { __mongoose_connection: Promise<typeof mongoose> }
  ).__mongoose_connection = promise;

  return promise;
}

const connection: Promise<typeof mongoose> =
  "__mongoose_connection" in globalThis
    ? (
        globalThis as unknown as {
          __mongoose_connection: Promise<typeof mongoose>;
        }
      )["__mongoose_connection"]
    : connect();

export default connection;

//@ts-expect-error The Next.js dev server doesn't play nice with Mongoose's model caching
export const safeModel: typeof model = (...[name, ...params]: Parameters<typeof model>) => {
  return name in mongoose.models ? mongoose.models[name] : model(name, ...params);
}

export type InferSchema<T> = T extends Model<infer S> ? S : never;
