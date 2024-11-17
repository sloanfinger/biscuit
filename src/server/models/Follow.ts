import { Schema } from "mongoose";
import { compileOnce } from ".";
import User from "./User";

const FollowSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: User, required: true },
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
  },
  {
    timestamps: true,
  },
);

FollowSchema.index({ actor: 1, review: 1 }, { unique: true });

const Follow = compileOnce("Follow", FollowSchema);
export default Follow;
