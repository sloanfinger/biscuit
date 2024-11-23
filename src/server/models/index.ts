import { env } from "@/env";
import { InferIdType } from "mongodb";
import mongoose, {
  type Types
} from "mongoose";
import equal from "fast-deep-equal";

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

export function model<Schema extends mongoose.Schema>(key: string, createSchema: () => Schema) {
  const schema = createSchema();
  const compile = () => mongoose.model(key, schema);

  if (key in mongoose.models) {
    if (equal(schema, mongoose.models[key].schema)) {
      return mongoose.models[key] as ReturnType<typeof compile>;
    }

    mongoose.deleteModel(key);
  }
  
  return compile();
}

export type InferSchema<T> = T extends mongoose.Model<infer S> ? S : never;

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
