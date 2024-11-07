import { ObjectId } from "mongodb";
import * as z from "zod";

export const users = z.object({
  _id: z.instanceof(ObjectId), 
  password: z.string(),
  verification: z.literal(true).or(z.string()),
  /**
    WARNING: This object will be signed into a JWT and stored as a cookie, which limits its size. 
    @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage
  */
  profile: z.object({
    email: z.string().email(),
    username: z.string().min(4),
    displayName: z.string().min(3).max(20).nullable().default(null),
    profileAvatar: z.string().url().nullable().default(null),
  }),

  //Additional User Info

  profileBanner: z.string().url().nullable().default(null),
  totalLikes: z.number().default(0),
  totalComments: z.number().default(0),

  //These are arrays of user IDs (following/followers).
  followingList: z.array(z.instanceof(ObjectId)).default([]),
  followersList: z.array(z.instanceof(ObjectId)).default([]),

  //List of objects containing the identifying info of music releases in the iTunes music API.
  //Not 100% sure what you wanted here, but feel free to change any of it.
  musicInfoList: z.array(z.object({
    songTitle: z.string(),
    artist: z.string(),
    trackID: z.string(),
    collectionID: z.string(),
  })).default([]),

  profileVisibilityEnum: z.enum(["public", "followers", "mutuals"]).default("public"),
  musicVisibilityEnum: z.enum(["public", "followers", "mutuals"]).default("public"),
  uniqueArtistsReviewed: z.number().default(0),
  uniqueReleasesReviewed: z.number().default(0),
  geographicLocation: z.string().nullable().default(null),
  biography: z.string().default(""),
});


export const reviews = z.object({
  _id: z.instanceof(ObjectId), 
  ownerID: z.instanceof(ObjectId), //ID of the owner of the review
  timestamp: z.string().date(),
  isViewable: z.boolean(),

  //Music Info
  collectionID: z.string(),
  trackID: z.string(), 
  artist: z.string(), 


  title: z.string().nullable().default(null),
  reviewContent: z.string().nullable().default(null),
  numberOflikes: z.number().default(0),
  numberOfComments: z.number().default(0),
});

export const comments = z.object({
  _id: z.instanceof(ObjectId), 
  ownerId: z.instanceof(ObjectId), //ID of comment owner.
  reviewId: z.instanceof(ObjectId), //ID of the review the comment refers to.
  parentCommentID: z.instanceof(ObjectId).nullable().default(null), //ID of the parent comment (only applicable if comment is a reply).
  timestamp: z.string().date(),
  commentContent: z.string(),
  numberOflikes: z.number().default(0),
  numberOfSubcomments: z.number().default(0),
});

