import { env } from "@/env";
import { InferIdType } from "mongodb";
import mongoose, { Model, model, type Types } from "mongoose";

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
export const compileOnce: typeof model = (
  ...[name, ...params]: Parameters<typeof model>
) => {
  return name in mongoose.models
    ? mongoose.models[name]
    : model(name, ...params);
};

export type InferSchema<T> = T extends Model<infer S> ? S : never;

type Filter<Obj, Predicate> = {
  [K in keyof Obj]: Obj[K] extends Predicate ? K : never;
}[keyof Obj];

type Rest<Arr extends [unknown, ...unknown[]]> = ((
  ...p: Arr
) => unknown) extends (p1: Arr[0], ...rest: infer R) => unknown
  ? R
  : never;

type DeepPick<
  Obj,
  Keys extends (string | number | symbol)[],
> = Keys[0] extends keyof Obj
  ? Keys extends [keyof Obj, ...string[]]
    ? { [K in Keys[0]]: DeepPick<Obj[K], Rest<Keys>> }
    : Pick<Obj, Keys[0]>
  : Obj;

export type Populate<
  Local,
  Foreign,
  Keys extends [Filter<InferSchema<Local>, Types.ObjectId>, ...string[]],
> = Omit<{ _id: InferIdType<Local> } & InferSchema<Local>, Keys[0]> & {
  [K in Keys[0]]: DeepPick<InferSchema<Foreign>, Rest<Keys>>;
};
