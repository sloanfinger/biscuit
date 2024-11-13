"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import * as zfd from "zod-form-data";
import { Result } from ".";
import { cookies } from "next/headers";
import connection from "@/server/models";
import User from "@/server/models/User";
import { hash } from "bcrypt";

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

  try {
    await connection;

    if ((await User.exists({ "profile.avatar.username": username })) === null) {
      return { success: true };
    }

    return { error: "Username is in use." };
  } catch {
    return { error: "Unexpected server error." };
  }
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

    const user = await new User({
      profile: {
        avatar: {
          username,
          displayName: username,
        },
      },
      settings: {
        email,
        password: await hash(password, 10),
      },
    }).save();

    if (await user.verify()) {
      return { success: "Account created successfully." };
    }

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
    const result = await signInSchema
      .parseAsync(formData)
      .then(User.authenticate);

    if (result === null) {
      return { error: "Please verify your email. A new link has been sent." };
    }

    (await cookies()).set(...result.cookie);
    redirect(`/@${result.session.avatar.username}`);
  } catch (_error: unknown) {
    return { error: "Username or password is incorrect" };
  }
}

export async function signOut() {
  (await cookies()).delete("jwt");
  redirect("/");
}
