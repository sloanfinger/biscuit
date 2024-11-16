"use client";

import useActionResult from "@/hooks/useActionResult";
import { toggleLike } from "@/server/actions/likes";
import { PiHeartFill, PiHeartBold } from "react-icons/pi";

interface Props {
  initialState: {
    hasLiked: boolean;
    likeCount: number;
  };
  reviewId: string;
}

export default function LikeButton({ initialState, reviewId }: Props) {
  const nf = new Intl.NumberFormat("en-US");
  const [state, trigger] = useActionResult(
    toggleLike,
    initialState,
    ({ hasLiked, likeCount }) => ({
      hasLiked: !hasLiked,
      likeCount: likeCount + (hasLiked ? -1 : 1),
    }),
  );

  return (
    <button
      className="flex items-center gap-2 rounded-md px-1 text-rose-400 hover:bg-rose-700/25"
      onClick={() => {
        trigger(reviewId);
      }}
    >
      {state.hasLiked ? <PiHeartFill /> : <PiHeartBold />}{" "}
      {nf.format(state.likeCount)} likes
    </button>
  );
}
