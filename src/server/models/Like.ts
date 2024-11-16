import { Schema } from "mongoose";
import { compileOnce } from ".";
import User from "./User";
import Review from "./Review";

const LikeSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: User, required: true },
    review: { type: Schema.Types.ObjectId, ref: Review, required: true },
  }
);

LikeSchema.index({ actor: 1, review: 1 }, { unique: true });

const Like = compileOnce("Like", LikeSchema);
export default Like;