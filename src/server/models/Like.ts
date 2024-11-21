import { Schema } from "mongoose";
import { model } from ".";
import Review from "./Review";
import User from "./User";

const Like = model("Like", () =>
  new Schema({
    actor: { type: Schema.Types.ObjectId, ref: User, required: true },
    review: { type: Schema.Types.ObjectId, ref: Review, required: true },
  }).index({ actor: 1, review: 1 }, { unique: true }),
);

export default Like;
