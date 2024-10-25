import { ObjectId } from "mongodb";
import * as z from "zod";

export const users = z.object({
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
