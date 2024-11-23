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
import { ObjectId } from "mongodb";
import { compare } from "bcrypt";

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

const updateAccountSchema = zfd.formData({
  username: zfd.text(
    z
      .string()
      .toLowerCase()
      .regex(/^[a-z_][0-9a-z_]{3,15}$/),
  ),
  displayName: zfd.text(
    z
      .string()
      .toLowerCase()
      .regex(/^.{3,15}$/),
  ),
  bio: zfd.text(z.string().optional()),
  avatarImageURL: zfd.text(z.string().url().optional()),
  bannerImageURL: zfd.text(z.string().url().optional()),
  email: zfd.text(z.string().email().toLowerCase()),
  password: zfd.text(z.string().min(8).optional()),
  confirmedPassword: zfd.text(z.string().min(8).optional()),
});

export async function updateAccount(_state: unknown, formData: FormData) {
  try {
    await connection;

    const session = await cookies()
      .then(User.authorize)
      .catch(() => {
        throw new Error("Not signed in.");
      });

      const user = await User.findOne({ _id: new ObjectId(session.id) }).catch(
        () => null
      );

      if (!user) {
        throw new Error("User not found.");
      }

    const data = await updateAccountSchema
      .parseAsync(formData)
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("Invalid form data.");
      });


    // Checks if inputted username is valid, and whether or not it equals the current one.
    //This ensures all users have unique usernames
    if (data.username && data.username !== user.profile.avatar.username) {
      //If not, it will search for users with that new username, and throw an error if it exists.
      const existingUserWithUsername = await User.findOne({
        "profile.avatar.username": data.username,
      });

      if (existingUserWithUsername) {
        throw new Error("Username is already in use.");
      }
    }

    // Same idea as the statement above, but for emails this time.
    // This ensures unique emails amongst all the users.
    if (data.email && data.email !== user.settings.email) {
      const existingUserWithEmail = await User.findOne({
        "settings.email": data.email,
      });
      if (existingUserWithEmail) {
        throw new Error("Email is already in use.");
      }
    }

    //Hashes new password
    const hashedPassword = data.password
      ? await hash(data.password, 10)
      : undefined;

    //Makes sure that the user correctly provided their old password before
    //trying to update to a new password.
    if (data.password) {
      if (!data.confirmedPassword) {
        throw new Error("Old password is required to update your password.");
      }

      const isOldPasswordCorrect = await compare(
        data.confirmedPassword,
        user.settings.password
      );

      if (!isOldPasswordCorrect) {
        throw new Error("Old password does not match.");
      }
    }

    //If no image is provided for either the banner or
    // the avatar, it will use the defaults.
    if (!data.bannerImageURL) {
      data.bannerImageURL = "https://picsum.photos/seed/3/1280/720";
    }

    if (!data.avatarImageURL) {
      data.avatarImageURL = "https://picsum.photos/128/128";
    }

    //If the bio is removed, sets the input data to an empty string.
    if (!data.bio) {
      data.bio = "";
    }

    // Use $set to update the user's fields
    const updateFields: Record<string, any> = {
      "profile.avatar.username": data.username,
      "profile.avatar.displayName": data.displayName,
      "profile.bio": data.bio,
      "profile.profileBanner": data.bannerImageURL,
      "profile.avatar.image": data.avatarImageURL,
      "settings.email": data.email,
    };
    
    if (hashedPassword) { 
      //If hashedPassword is not undefined (it exists),
      //Add it to the list of things to update about the user.
      updateFields["settings.password"] = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected error occurred.");
    });

    if (!updatedUser) {
      throw new Error("User update failed.");
    }
    
    // Retrieve the updated user instance to ensure methods like `setToken` work
    const refreshedUser = await User.findById(updatedUser._id);
    if (!refreshedUser) {
      throw new Error("Failed to reload updated user.");
    }

    const updatedSession = await refreshedUser.setToken(cookies());

    redirect(`/@${updatedSession.avatar.username}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return { error: (error as Error).message };
  }
}