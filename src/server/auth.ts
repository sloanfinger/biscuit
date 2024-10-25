import { env } from "@/env";
import connect, { type Collections, Schema } from "@/server/db";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { addDays } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import * as SendGrid from "@sendgrid/mail";

SendGrid.setApiKey(env.SENDGRID_API_KEY);

/**
 * Sends a verification link to a user.
 * @param email Where to send the verification link.
 * @returns A hash of the verification token to be stored in the database.
 */
async function sendVerification(email: string) {
  const token = randomBytes(256).toString("base64");
  const tokenHash = await hash(token, 10).catch((error: unknown) => {
    console.error(error);
    throw new Error("An unexpected server error occurred.");
  });
  const link = `http://localhost:3000/onboarding/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  await SendGrid.send({
    from: "noreply@biscuit.sloan.fm",
    to: email,
    subject: "Your Email Verification Link",
    text: link,
    html: `<a href="${link}">${link}</a>`,
  });

  return tokenHash;
}

/**
 * Creates a JWT to be stored in a user's cookie.
 * @param profile The user profile to include in the JWT.
 * @returns A JWT with its expiration timestamp.
 */
async function sign(profile: Collections["users"]["profile"]) {
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
export async function addUser({
  password,
  profile,
}: Omit<Collections["users"], "verification">) {
  const { from } = await connect();

  const emailExists = await from("users")
    .findOne({ "profile.email": profile.email })
    .then((result) => result !== null)
    .catch(() => false);

  if (emailExists) {
    throw new Error("User with email already exists.");
  }

  const usernameExists = await from("users")
    .findOne({ "profile.username": profile.username })
    .then((result) => result !== null)
    .catch(() => false);

  if (usernameExists) {
    throw new Error("User with username already exists.");
  }

  const [passwordHash, verificationHash] = await Promise.all([
    hash(password, 10),
    sendVerification(profile.email),
  ]).catch((error: unknown) => {
    console.error(error);
    throw new Error("An unexpected server error occurred.");
  });

  await from("users")
    .insertOne({
      password: passwordHash,
      verification: verificationHash,
      profile,
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
export async function authenticateCredentials(email: string, password: string) {
  const { from } = await connect();

  const user = await from("users")
    .findOne({ "profile.email": email })
    .then((data) => Schema.users.parseAsync(data))
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("Email or password is incorrect.");
    });

  if (!(await compare(password, user.password))) {
    throw new Error("Email or password is incorrect.");
  }

  if (user.verification !== true) {
    await from("users").updateOne(
      { "profile.email": email },
      { $set: { verification: await sendVerification(email) } },
    );
    throw new Error(
      "Account is not verified. A new verification email has been sent.",
    );
  }

  const { jwt, expires } = await sign(user.profile).catch(() => {
    throw new Error("Failed to sign JWT.");
  });
  (await cookies()).set("jwt", jwt, { expires });

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
export async function authenticateToken(email: string, token: string) {
  const { from, after } = await connect();

  const user = await from("users")
    .findOne({ "profile.email": email })
    .then((data) => Schema.users.parseAsync(data))
    .catch((error: unknown) => {
      console.error(error);
      throw new Error("User does not exist.");
    });

  if (user.verification === true) {
    throw new Error("User has already verified themselves.");
  }

  if (!(await compare(token, user.verification))) {
    throw new Error("Token is incorrect.");
  }

  after(() =>
    from("users").updateOne(
      { "profile.email": email },
      { $set: { verification: true } },
    ),
  );

  const { jwt, expires } = await sign(user.profile).catch(() => {
    throw new Error("Failed to sign JWT.");
  });
  (await cookies()).set("jwt", jwt, { expires });

  return {
    profile: user.profile,
  };
}

/**
 * Verifies the JWT cookie stored in the request.
 * @returns The user profile.
 */
export async function authorize() {
  const jwt = (await cookies()).get("jwt")?.value;

  if (jwt === undefined) {
    throw new Error("Not signed in.");
  }

  const { payload } = await jwtVerify(jwt, env.JWT_SECRET, {
    issuer: env.DB_NAME,
  });

  return await Schema.users.shape.profile.parseAsync(payload).catch(() => {
    throw new Error("An unexpected server error occurred.");
  });
}

/**
 * Deletes the JWT cookie from the request.
 * @returns An acknowledgement of whether the deletion was sucessful.
 */
export async function deleteSession() {
  (await cookies()).delete("jwt");
  return { acknowledged: true };
}
