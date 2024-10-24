"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import * as zfd from "zod-form-data";
import { addUser, authenticateCredentials, deleteSession } from "./auth";
import connect from "./db";

type Result<T> = Promise<
  (T extends never ? never : { success: T }) | { error: string }
>;

export async function validateUsername(username: string): Result<boolean> {
  if (!/^[a-z_]/i.test(username)) {
    return { error: "Usernames can only start with letter or underscore." };
  }

  if (!/^[a-z_][0-9a-z_]+/i.test(username)) {
    return { error: "Only letters, numbers, and underscores are allowed." };
  }

  if (username.length < 4) {
    return { error: "Username is too short." };
  }

  if (username.length > 16) {
    return { error: "Username is too long." };
  }

  const { from } = await connect();

  const usernameExists = await from("users")
    .findOne({ "profile.username": username })
    .then((result) => result !== null)
    .catch(() => false);

  if (usernameExists) {
    return { error: "Username is already in use." };
  }

  return { success: true };
}

const createAccountSchema = zfd.formData({
  username: zfd.text(
    z
      .string()
      .toLowerCase()
      .regex(/^[a-z_][0-9a-z_]{3,15}$/),
  ),
  email: zfd.text(z.string().email().toLowerCase()),
  password: zfd.text(z.string().min(8)),
});

export async function createAccount(
  _state: unknown,
  formData: FormData,
): Result<string> {
  try {
    const { username, email, password } = await createAccountSchema
      .parseAsync(formData)
      .catch(() => {
        throw new Error("Email or password is invalid.");
      });

    await addUser({
      password,
      profile: { username, email },
    });

    return {
      success:
        "To finish creating your account, check your email for a verification link.",
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

const signInSchema = zfd.formData({
  email: zfd.text(z.string().email()),
  password: zfd.text(z.string().min(1)),
});

export async function signIn(
  _state: unknown,
  formData: FormData,
): Result<never> {
  try {
    const { email, password } = await signInSchema.parseAsync(formData);
    await authenticateCredentials(email, password);
  } catch (error) {
    return { error: (error as Error).message };
  } finally {
    redirect("/");
  }
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}
