import { ObjectId, Timestamp } from "mongodb";
import * as z from "zod";

export const users = z.object({
  _id: z.instanceof(ObjectId),
  profile: z.object({
    profileBanner: z.string().url().nullable().default(null),
    location: z.string().nullable().default(null),
    bio: z.string().default(""),
    network: z.object({
      followers: z.array(z.instanceof(ObjectId)).default([]),
      following: z.array(z.instanceof(ObjectId)).default([]),
    }),
    stats: z.object({
      likes: z.number().default(0),
      comments: z.number().default(0),
      artists: z.number().default(0),
      releases: z.number().default(0),
    }),
    queue: z
      .array(z.object({ type: z.literal("album"), releaseId: z.string() }))
      .default([]),
    /**
      WARNING: This object will be signed into a JWT and stored as a cookie, which limits its size. 
      @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage
     */
    avatar: z.object({
      image: z.string().url().nullable().default(null),
      username: z.string().min(4).max(20),
      displayName: z.string().min(3).max(20),
    }),
  }),

  settings: z.object({
    email: z.string().email(),
    password: z.string(),
    verification: z.literal(true).or(z.string()),
    profileVisibility: z
      .enum(["public", "followers", "mutuals"])
      .default("public"),
    musicVisibility: z
      .enum(["public", "followers", "mutuals"])
      .default("public"),
  }),
});

export const reviews = z.object({
  _id: z.instanceof(ObjectId),
  ownerId: z.instanceof(ObjectId), // ID of the owner of the review
  timestamp: z.instanceof(Timestamp),
  isDraft: z.boolean(),

  releaseId: z.string(),
  artistId: z.string(),

  rating: z.number().min(0).max(5).step(0.5),
  content: z.string().nullable().default(null),

  likeCount: z.number().default(0),
  commentCount: z.number().default(0),
});

export const comments = z.object({
  _id: z.instanceof(ObjectId),
  ownerId: z.instanceof(ObjectId), //ID of comment owner.
  reviewId: z.instanceof(ObjectId), //ID of the review the comment refers to.
  parentCommentId: z.instanceof(ObjectId).nullable().default(null), //ID of the parent comment (only applicable if comment is a reply).
  timestamp: z.string().date(),
  content: z.string(),
  likeCount: z.number().default(0),
  commentCount: z.number().default(0),
});
