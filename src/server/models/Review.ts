import { Schema } from "mongoose";
import User from "./User";
import { model } from ".";

const Review = model("Review", () =>
  new Schema(
    {
      author: { type: Schema.Types.ObjectId, ref: User, required: true },
      isDraft: { type: Boolean, required: true },
      releaseId: { type: String, required: true },
      artistId: { type: String, required: true },
      rating: { type: Number, required: true, min: 0, max: 5 },
      content: { type: String },
      likeCount: { type: Number, required: true, default: 0 },
      commentCount: { type: Number, required: true, default: 0 },
    },
    { timestamps: true },
  )
    .index({ author: 1, releaseId: 1 }, { unique: true })
    .index({ author: 1, artistId: 1 }),
);

export default Review;
