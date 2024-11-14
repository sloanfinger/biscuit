"use server";

import User from "@/server/models/User";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import * as zfd from "zod-form-data";
import connection from "../models";
import Review from "../models/Review";

const createReviewSchema = zfd.formData({
  releaseId: zfd.text(),
  artistId: zfd.text(),
  rating: zfd.numeric(z.number().min(0).max(5).step(0.5)),
  content: zfd.text(z.string().trim().optional()),
  shouldPublish: zfd.checkbox(),
});

export async function createReview(_state: unknown, formData: FormData) {
  try {
    const session = await cookies()
      .then(User.authorize)
      .catch(() => {
        throw new Error("Not signed in.");
      });

    const data = await createReviewSchema
      .parseAsync(formData)
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("Invalid form data.");
      });

    const ownerId = ObjectId.createFromHexString(session.id);
    await connection;

    const updateResult = await Review.findOneAndUpdate(
      {
        owner: ownerId,
        releaseId: data.releaseId,
      },
      {
        $set: {
          isDraft: !data.shouldPublish,
          rating: data.rating,
          content: data.content ?? null,
        },
      },
    ).catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected error occurred.");
    });

    if (updateResult !== null) {
      revalidatePath(`/@${session.avatar.username}`, "page");
      redirect(`/@${session.avatar.username}`);
    }

    const [_, otherExists] = await Promise.all([
      await new Review({
        owner: ownerId,
        isDraft: !data.shouldPublish,
        releaseId: data.releaseId,
        artistId: data.artistId,
        rating: data.rating,
        content: data.content ?? null,
        likeCount: 0,
        commentCount: 0,
      }).save(),
      Review.exists({
        ownerId,
        artistId: data.artistId,
        releaseId: { $not: { $eq: data.releaseId } },
      }).then((result) => result !== null),
    ]).catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected error occurred.");
    });

    await User.findOneAndUpdate(
      { _id: ownerId },
      {
        $inc: {
          "profile.stats.releases": 1,
          "profile.stats.artists": otherExists ? 0 : 1,
        },
      },
    ).catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected error occurred.");
    });

    revalidatePath(`/@${session.avatar.username}`, "page");
    redirect(`/@${session.avatar.username}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { error: (error as Error).message };
  }
}

interface DeleteReviewParams {
  releaseId: string;
  revalidate: string;
}

export async function deleteReview(
  _state: unknown,
  { releaseId, revalidate }: DeleteReviewParams,
) {
  try {
    const session = await cookies()
      .then(User.authorize)
      .catch(() => {
        throw new Error("Not signed in.");
      });

    const ownerId = ObjectId.createFromHexString(session.id);
    await connection;

    const deleted = await Review.findOneAndDelete({
      owner: ownerId,
      releaseId,
    });

    if (deleted === null) {
      console.error("Review does not exist.");
      return { success: false } as const;
    }

    const otherExists = await Review.exists({
      owner: ownerId,
      artistId: deleted.artistId,
      releaseId: { $not: { $eq: releaseId } },
    })
      .then((result) => result !== null)
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("An unexpected error occurred.");
      });

    await User.updateOne(
      { _id: ownerId },
      {
        $inc: {
          "profile.stats.releases": -1,
          "profile.stats.artists": otherExists ? 0 : -1,
        },
      },
    );

    revalidatePath(revalidate);
    return { success: true } as const;
  } catch (error: unknown) {
    console.error(error);
    return { error: "Failed to delete review." } as const;
  }
}
