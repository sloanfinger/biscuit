"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import * as zfd from "zod-form-data";
import { Result } from ".";
import { cookies } from "next/headers";
import connection from "@/server/models";
import User from "@/server/models/User";
import { hash } from "bcrypt";
import { isRedirectError } from "next/dist/client/components/redirect";

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
    })
      .save()
      .catch(() => {
        throw new Error("This email is already in use.");
      });

    if (await user.verify()) {
      const session = await user.setToken(cookies());
      redirect(`/@${session.avatar.username}`);
    }

    return {
      success:
        "To finish creating your account, check your email for a verification link.",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

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
    const { email, ...credentials } = await signInSchema.parseAsync(formData);

    const user = await User.findOne({ "settings.email": email });

    if (user === null) {
      throw new Error(`User with email ${email} does not exist in database.`);
    }

    const session = await user
      .authenticate(credentials)
      .then(() => user.setToken(cookies()));

    redirect(`/@${session.avatar.username}`);
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error(error);
    return { error: "Username or password is incorrect" };
  }
}

export async function signOut() {
  (await cookies()).delete("jwt");
  redirect("/");
}
