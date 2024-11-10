"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import * as zfd from "zod-form-data";
import { authorize } from "../auth";
import connect from "../db";

const createReviewSchema = zfd.formData({
  releaseId: zfd.text(),
  artistId: zfd.text(),
  rating: zfd.numeric(z.number().min(0).max(5).step(0.5)),
  content: zfd.text(z.string().trim().optional()),
  shouldPublish: zfd.checkbox(),
});

export async function createReview(_state: unknown, formData: FormData) {
  try {
    const session = await authorize(await cookies()).catch(() => {
      throw new Error("Not signed in.");
    });

    const data = await createReviewSchema
      .parseAsync(formData)
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("Invalid form data.");
      });

    const ownerId = ObjectId.createFromHexString(session.id);
    const { from } = await connect();

    const updateResult = await from("reviews")
      .findOneAndUpdate(
        {
          ownerId,
          releaseId: data.releaseId,
        },
        {
          $currentDate: { timestamp: { $type: "timestamp" } },
          $set: {
            isDraft: !data.shouldPublish,
            rating: data.rating,
            content: data.content ?? null,
          },
        },
      )
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("An unexpected error occurred.");
      });

    if (updateResult !== null) {
      redirect(`/@${session.avatar.username}`);
    }

    const createResult = await from("reviews")
      .insertOne({
        ownerId,
        timestamp: new Date(),
        isDraft: !data.shouldPublish,
        releaseId: data.releaseId,
        artistId: data.artistId,
        rating: data.rating,
        content: data.content ?? null,
        likeCount: 0,
        commentCount: 0,
      })
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("An unexpected error occurred.");
      });

    if (!createResult.acknowledged) {
      throw new Error("An unexpected error occurred.");
    }

    const other = await from("reviews")
      .findOne({
        ownerId,
        artistId: data.artistId,
        releaseId: { $not: { $eq: data.releaseId } },
      })
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("An unexpected error occurred.");
      });

    await from("users")
      .findOneAndUpdate(
        { _id: ownerId },
        {
          $inc: {
            "profile.stats.releases": 1,
            "profile.stats.artists": other === null ? 1 : 0,
          },
        },
      )
      .catch((error: unknown) => {
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
    const session = await authorize(await cookies()).catch(() => {
      throw new Error("Not signed in.");
    });

    const ownerId = ObjectId.createFromHexString(session.id);
    const { from } = await connect();

    const result = await from("reviews").deleteOne({ ownerId, releaseId });

    if (!result.acknowledged) {
      throw new Error("An unexpected error occurred.");
    }

    revalidatePath(revalidate);
    return { success: true } as const;
  } catch (error: unknown) {
    console.error(error);
    return { error: "Failed to delete review." } as const;
  }
}
