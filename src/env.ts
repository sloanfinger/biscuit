import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { createSecretKey } from "crypto";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["production","development","test"]),
    JWT_SECRET: z
      .string()
      .min(32)
      .transform((secret) => createSecretKey(secret, "utf-8")),
    MONGO_URI: z.string().url(),
    DB_NAME: z.string(),
    SENDGRID_API_KEY: z.string(),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  },
});
