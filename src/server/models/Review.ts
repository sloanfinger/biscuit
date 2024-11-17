import { Schema } from "mongoose";
import { compileOnce } from ".";
import User from "./User";

const ReviewSchema = new Schema(
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
);

ReviewSchema.index({ owner: 1, releaseId: 1 }, { unique: true });
ReviewSchema.index({ owner: 1, artistId: 1 });

const Review = compileOnce("Review", ReviewSchema);
export default Review;