"use server";

import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { Result } from ".";
import Like from "../models/Like";
import Review from "../models/Review";
import User from "../models/User";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function getLikeStatus(
  reviewId: string,
): Result<{ status: boolean }> {
  try {
    const session = await cookies()
      .then(User.authorize)
      .catch(() => null);

    if (session === null) {
      return { error: "Not logged in." };
    }

    const status = await Like.exists({
      actor: ObjectId.createFromHexString(session.id),
      review: ObjectId.createFromHexString(reviewId),
    }).then((result) => result !== null);

    return {
      success: {
        status,
      },
    };
  } catch (error: unknown) {
    console.error(error);
    return { error: "An unknown error occurred." };
  }
}

export async function toggleLike(
  _state: unknown,
  reviewId: string,
): Result<{ hasLiked: boolean; likeCount: number }> {
  try {
    const session = await cookies()
      .then(User.authorize)
      .catch(() => null);

    if (session === null) {
      redirect("/login");
    }

    const actor = ObjectId.createFromHexString(session.id);
    const review = ObjectId.createFromHexString(reviewId);
    const deleteResult = await Like.deleteOne({ actor, review }).then(
      ({ deletedCount }) => deletedCount !== 0,
    );

    if (!deleteResult) {
      await new Like({ actor, review }).save();
    }

    const updatedReview = await Review.findByIdAndUpdate(
      review,
      {
        $inc: { likeCount: deleteResult ? -1 : 1 },
      },
      { new: true },
    );

    if (updatedReview === null) {
      throw new Error("Review does not exist.");
    }

    return {
      success: {
        hasLiked: !deleteResult,
        likeCount: updatedReview.likeCount,
      },
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error(error);
    return { error: "An unknown error occurred." };
  }
}
