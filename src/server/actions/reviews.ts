"use server";

import User from "@/server/models/User";
import { ObjectId } from "mongodb";
import type { Document, SortOrder, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import * as zfd from "zod-form-data";
import { Result } from ".";
import connection, { Populate } from "../models";
import Review from "../models/Review";
import { lookup, Release } from "./itunes";
import { getLikeStatus } from "./likes";

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

    const author = ObjectId.createFromHexString(session.id);
    await connection;

    const updateResult = await Review.findOneAndUpdate(
      {
        author,
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
        author,
        isDraft: !data.shouldPublish,
        releaseId: data.releaseId,
        artistId: data.artistId,
        rating: data.rating,
        content: data.content ?? null,
        likeCount: 0,
        commentCount: 0,
      }).save(),
      Review.exists({
        author,
        artistId: data.artistId,
        releaseId: { $not: { $eq: data.releaseId } },
      }).then((result) => result !== null),
    ]).catch((error: unknown) => {
      console.error(error);
      throw new Error("An unexpected error occurred.");
    });

    await User.findOneAndUpdate(
      { _id: author },
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

type PopulatedReview = Populate<
  typeof Review,
  typeof User,
  ["author", "profile", "avatar"]
>;

const sortings = {
  recent: { createdAt: -1 },
  trending: { updatedAt: -1 },
  popular: { likeCount: -1 },
  controversial: { commentCount: -1 },
} satisfies Record<string, Partial<Record<keyof PopulatedReview, SortOrder>>>;

export interface GetReviewsParams {
  sortBy: keyof typeof sortings;
  limit: number;
  author?: string;
}

export interface ReviewProps {
  hasLiked: boolean;
  release: Release;
  review: Omit<PopulatedReview, "_id"> & { _id: string };
}

export async function getReviews({
  author,
  limit,
  sortBy,
}: GetReviewsParams): Result<ReviewProps[]> {
  "use server";

  try {
    await connection;

    const reviews: Promise<ReviewProps | null>[] = [];
    const cursor = Review.find<
      Document<Types.ObjectId, unknown, PopulatedReview>
    >(
      author
        ? { author, isDraft: false }
        : {
            isDraft: false,
          },
    )
      .populate("author", "profile.avatar")
      .sort(sortings[sortBy])
      .limit(limit + 1);

    for await (const doc of cursor) {
      //@ts-expect-error `flattenObjectIds` does not affect the return type of `toObject()`
      const review: Omit<PopulatedReview, "_id"> & { _id: string } =
        doc.toObject({
          flattenObjectIds: true,
        });

      reviews.push(
        Promise.all([
          lookup(review.releaseId, {
            limit: "1",
            entity: "album",
          }).then((result) => {
            if ("error" in result) {
              throw new Error(result.error);
            }

            if (result.success.length === 0) {
              throw new Error("Release not found.");
            }

            return result.success[0];
          }),
          getLikeStatus(review._id)
            .then((result) => "success" in result && result.success.status)
            .catch(() => false),
        ]).then(([release, hasLiked]) => ({ hasLiked, release, review })),
      );
    }

    return {
      success: (await Promise.all(reviews)).filter((review) => review !== null),
    };
  } catch (error: unknown) {
    console.error(error);
    return { error: "An unknown error occurred." };
  }
}

export async function deleteReview(
  _state: unknown,
  releaseId: string,
  revalidateParams: GetReviewsParams,
) {
  try {
    const session = await cookies()
      .then(User.authorize)
      .catch(() => {
        throw new Error("Not signed in.");
      });

    const author = ObjectId.createFromHexString(session.id);
    await connection;

    const deleted = await Review.findOneAndDelete({
      author,
      releaseId,
    });

    if (deleted === null) {
      throw new Error("Review does not exist.");
    }

    const otherExists = await Review.exists({
      author,
      artistId: deleted.artistId,
      releaseId: { $not: { $eq: releaseId } },
    })
      .then((result) => result !== null)
      .catch((error: unknown) => {
        console.error(error);
        throw new Error("An unexpected error occurred.");
      });

    await User.updateOne(
      { _id: author },
      {
        $inc: {
          "profile.stats.releases": -1,
          "profile.stats.artists": otherExists ? 0 : -1,
        },
      },
    );

    return await getReviews(revalidateParams);
  } catch (error: unknown) {
    console.error(error);
    return { error: "Failed to delete review." } as const;
  }
}

//New Code
//Param: id string from User schema
export async function getUserReviews(id: string) {
  try {
    //includes all User data with populate
    const reviews = await Review.find({owner: id}).populate("owner");
    return reviews;
  } catch(error) {
    console.error(error);
    throw new Error("An unexpected error occurred.");
  }
}
