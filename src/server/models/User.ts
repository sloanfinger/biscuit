import { env } from "@/env";
import SendGrid from "@sendgrid/mail";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { addDays } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import { Schema } from "mongoose";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import * as z from "zod";
import { model } from ".";

type Credentials = { password: string } | { token: string };

if (env.SENDGRID_API_KEY) {
  SendGrid.setApiKey(env.SENDGRID_API_KEY);
}

const jwtSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/),
  avatar: z.object({
    image: z.string().url().nullable().default(null).optional(),
    username: z.string().min(4).max(20),
    displayName: z.string().min(3).max(20),
  }),
});

export type Token = z.infer<typeof jwtSchema>;

const User = model(
  "User",
  () =>
    new Schema(
      {
        profile: {
          type: {
            profileBanner: { type: String, default: null },
            location: { type: String, default: null },
            bio: { type: String, required: false, default: null, trim: true },
            queue: {
              type: [
                {
                  releaseId: { type: String, required: true },
                  type: { type: String, required: true, enum: ["album"] },
                },
              ],
              required: true,
              default: [],
            },
            stats: {
              type: {
                followers: { type: Number, required: true },
                following: { type: Number, required: true },
                likes: { type: Number, required: true },
                comments: { type: Number, required: true },
                artists: { type: Number, required: true },
                releases: { type: Number, required: true },
              },
              required: true,
              default: {
                followers: 0,
                following: 0,
                likes: 0,
                comments: 0,
                artists: 0,
                releases: 0,
              },
            },
            avatar: {
              type: {
                image: { type: String, default: null, required: false },
                username: {
                  type: String,
                  minLength: 4,
                  maxLength: 20,
                  required: true,
                  unique: true,
                },
                displayName: {
                  type: String,
                  minLength: 3,
                  maxLength: 20,
                  required: true,
                },
              },
              required: true,
            },
          },
          required: true,
        },
        settings: {
          type: {
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            verification: { type: String },
            profileVisibility: {
              type: String,
              required: true,
              enum: ["public", "followers", "mutuals"],
              default: "public",
            },
            musicVisibility: {
              type: String,
              required: true,
              enum: ["public", "followers", "mutuals"],
              default: "public",
            },
          },
          required: true,
        },
      },
      {
        methods: {
          /**
           * Sends a verification link to a user if they have yet to verify their email.
           * @returns `true` if the user is verified; `false` if the user is not verified.
           */
          async verify() {
            if (
              env.SENDGRID_API_KEY === null ||
              this.settings.verification === "true"
            ) {
              return true;
            }

            const token = randomBytes(256).toString("base64");
            const link = `https://biscuit.sloan.fm/onboarding/verify?email=${encodeURIComponent(this.settings.email)}&token=${encodeURIComponent(token)}`;

            await Promise.all([
              SendGrid.send({
                from: "noreply@biscuit.sloan.fm",
                to: this.settings.email,
                subject: "Your Email Verification Link",
                text: link,
                html: `<a href="${link}">${link}</a>`,
              }),
              hash(token, 10).then((hash) =>
                this.set("settings.verification", hash).save(),
              ),
            ]);

            return false;
          },
          /**
           * Creates a JWT-based session for the user.
           * @returns An object with a `session` object and a `cookie` array (to be passed to `ReadOnlyRequestCookies.set`)
           */
          async setToken(cookiesPromise: Promise<ReadonlyRequestCookies>) {
            const issued = new Date();
            const expires = addDays(issued, 30);
            const jwt: z.infer<typeof jwtSchema> = {
              id: this._id.toHexString(),
              avatar: this.profile.avatar,
            };

            const [cookies, token] = await Promise.all([
              cookiesPromise,
              new SignJWT(jwt)
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt(issued)
                .setIssuer(env.DB_NAME)
                .setExpirationTime(expires)
                .sign(env.JWT_SECRET),
              { expires },
            ]);

            cookies.set("jwt", token);
            return jwt;
          },
          /**
           * Validates a user's credentials, creating a JWT if successful.
           * @param credentials A user's email, paired with either a verification token or their password.
           * @returns Data to be stored in a JWT. Data will be `null` if the user needs to complete verification
           */
          async authenticate(credentials: Credentials) {
            if ("password" in credentials) {
              if (
                !(await compare(credentials.password, this.settings.password))
              ) {
                throw new Error("Password is incorrect");
              }
            }

            if ("token" in credentials) {
              if (
                !this.settings.verification ||
                (await compare(credentials.token, this.settings.verification))
              ) {
                throw new Error("Token is incorrect");
              }

              await this.set("settings.verification", "true").save();
            }
          },
        },
        statics: {
          /**
           * Verifies the JWT cookie stored in the request.
           * @returns The stored session data.
           */
          async authorize(cookies: ReadonlyRequestCookies) {
            const cookie = cookies.get("jwt");

            if (cookie === undefined) {
              throw new Error("JWT is not present in request cookie.");
            }

            const { payload } = await jwtVerify(cookie.value, env.JWT_SECRET, {
              issuer: env.DB_NAME,
            });

            return await jwtSchema.parseAsync(payload).catch(() => {
              throw new Error("An unexpected server error occurred.");
            });
          },
        },
      },
    ),
);

export default User;
