import { Schema } from "mongoose";
import { model } from ".";
import User from "./User";

const Follow = model("Follow", () =>
  new Schema(
    {
      actor: { type: Schema.Types.ObjectId, ref: User, required: true },
      user: { type: Schema.Types.ObjectId, ref: User, required: true },
    },
    {
      timestamps: true,
    },
  ).index({ actor: 1, review: 1 }, { unique: true }),
);
export default Follow;
