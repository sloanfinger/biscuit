import { env } from "@/env";
import connect, { Schema } from "@/server/db";
import * as SendGrid from "@sendgrid/mail";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { addDays } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { unstable_after as after } from "next/server";
import * as z from "zod";

if (env.SENDGRID_API_KEY) {
  SendGrid.setApiKey(env.SENDGRID_API_KEY);
}

const jwtSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/),
  avatar: Schema.users.shape.profile.shape.avatar,
});

export type JWT = z.infer<typeof jwtSchema>;

/**
 * Sends a verification link to a user.
 * @param email Where to send the verification link.
 * @returns A hash of the verification token to be stored in the database.
 */
async function sendVerification(email: string) {
  if (env.SENDGRID_API_KEY === null) {
    return true;
  }

  const token = randomBytes(256).toString("base64");
  const tokenHash = await hash(token, 10).catch((error: unknown) => {
    console.error(error);
    throw new Error("An unexpected server error occurred.");
  });
  const link = `https://biscuit.sloan.fm/onboarding/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  if (env.SENDGRID_API_KEY) {
    await SendGrid.send({
      from: "noreply@biscuit.sloan.fm",
      to: email,
      subject: "Your Email Verification Link",
      text: link,
      html: `<a href="${link}">${link}</a>`,
    });
  } else {
    console.log(link);
  }

  return tokenHash;
}

/**
 * Creates a JWT to be stored in a user's cookie.
 * @param profile The user profile to include in the JWT.
 * @returns A JWT with its expiration timestamp.
 */
async function sign(profile: z.input<typeof jwtSchema>) {
  const issued = new Date();
  const expires = addDays(new Date(), 30);
  const jwt = await new SignJWT(profile)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(issued)
    .setIssuer(env.DB_NAME)
    .setExpirationTime(expires)
    .sign(env.JWT_SECRET);

  return { jwt, expires };
}

/**
 * Creates a new user. If successful, adds a signed JWT to the response cookie.
 * @param user The initial password, profile, etc. for the user.
 */
export async function addUser(
  username: string,
  email: string,
  password: string,
) {
  const { from } = await connect();

  const user = await from("users")
    .findOne({
      $or: [
        { "profile.avatar.username": username },
        { "settings.email": email },
      ],
    })
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected server error occurred.");
    });

  if (user?.settings.email === email) {
    throw new Error("User with email already exists.");
  }

  if (user?.profile.avatar.username === username) {
    throw new Error("User with username already exists.");
  }

  const [passwordHash, verificationHash] = await Promise.all([
    hash(password, 10),
    sendVerification(email),
  ]).catch((error: unknown) => {
    console.error(error);
    throw new Error("An unexpected server error occurred.");
  });

  await from("users")
    .insertOne({
      profile: {
        avatar: {
          username,
          displayName: username,
          image: null,
        },
        network: {
          followers: [],
          following: [],
        },
        stats: {
          likes: 0,
          comments: 0,
          artists: 0,
          releases: 0,
        },
        profileBanner: null,
        location: null,
        bio: "",
        queue: [],
      },
      settings: {
        email,
        password: passwordHash,
        verification: verificationHash,
        profileVisibility: "public",
        musicVisibility: "public",
      },
    })
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected server error occurred.");
    });
}

/**
 * Validates a user's credentials. If successful, adds a signed JWT to the response cookie.
 * @param email User-identifying email.
 * @param password User password.
 * @returns The user profile.
 */
export async function authenticateCredentials(
  email: string,
  password: string,
  cookies: ReadonlyRequestCookies,
) {
  const { from } = await connect();

  const user = await from("users")
    .findOne({ "settings.email": email })
    .then((data) => Schema.users.parseAsync(data))
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("Email or password is incorrect.");
    });

  if (!(await compare(password, user.settings.password))) {
    throw new Error("Email or password is incorrect.");
  }

  if (user.settings.verification !== true) {
    await from("users").updateOne(
      { "settings.email": email },
      { $set: { "settings.verification": await sendVerification(email) } },
    );
    throw new Error(
      "Account is not verified. A new verification email has been sent.",
    );
  }

  const { jwt, expires } = await sign({
    id: user._id.toHexString(),
    avatar: user.profile.avatar,
  }).catch(() => {
    throw new Error("Failed to sign JWT.");
  });

  cookies.set("jwt", jwt, { expires });

  return {
    profile: user.profile,
  };
}

/**
 * Validates a user from a verification token. If successful, adds a signed JWT to the response cookie.
 * @param email User-identifying email.
 * @param password User password.
 * @returns The user profile.
 */
export async function authenticateToken(
  email: string,
  token: string,
  cookies: ReadonlyRequestCookies,
) {
  const { from } = await connect();

  const user = await from("users")
    .findOne({ "profile.email": email })
    .then((data) => Schema.users.parseAsync(data))
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("User does not exist.");
    });

  if (user.settings.verification === true) {
    throw new Error("User has already verified themselves.");
  }

  if (!(await compare(token, user.settings.verification))) {
    throw new Error("Token is incorrect.");
  }

  after(async () => {
    await from("users").updateOne(
      { "profile.email": email },
      { $set: { verification: true } },
    );
  });

  const { jwt, expires } = await sign({
    id: user._id.toHexString(),
    avatar: user.profile.avatar,
  }).catch(() => {
    throw new Error("Failed to sign JWT.");
  });
  cookies.set("jwt", jwt, { expires });

  return {
    profile: user.profile,
  };
}

/**
 * Verifies the JWT cookie stored in the request.
 * @returns The user profile.
 */
export async function authorize(cookies: ReadonlyRequestCookies) {
  const jwt = cookies.get("jwt")?.value;

  if (jwt === undefined) {
    throw new Error("Not signed in.");
  }

  const { payload } = await jwtVerify(jwt, env.JWT_SECRET, {
    issuer: env.DB_NAME,
  });

  return await jwtSchema.parseAsync(payload).catch(() => {
    throw new Error("An unexpected server error occurred.");
  });
}

/**
 * Deletes the JWT cookie from the request.
 * @returns An acknowledgement of whether the deletion was sucessful.
 */
export function deleteSession(cookies: ReadonlyRequestCookies) {
  cookies.delete("jwt");
  return { acknowledged: true };
}
