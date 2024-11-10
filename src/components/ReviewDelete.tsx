"use client";

import { startTransition, useActionState, useCallback, useEffect } from "react";
import { useToast } from "./Toast";
import { deleteReview } from "@/server/actions/reviews";
import { PiTrash, PiWarningBold } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  releaseId: string;
}

export default function ReviewDelete({ releaseId }: Props) {
  const { publish } = useToast();
  const [state, action, isPending] = useActionState(deleteReview, null);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = useCallback(() => {
    startTransition(() => {
      action({
        releaseId,
        revalidate: pathname,
      });
    });
  }, []);

  useEffect(() => {
    if (state !== null && state.error) {
      publish({
        className: "bg-red-300 border-red-800 text-red-950",
        icon: PiWarningBold,
        message: state.error,
      });
    }

    router.refresh();
  }, [state]);

  return (
    <button
      className="-m-[3px] rounded-md border border-red-400/50 bg-red-700/25 p-0.5 text-red-400 hover:border-red-400"
      disabled={isPending}
      onClick={handleClick}
      title="Delete Review"
      type="button"
    >
      <PiTrash />
    </button>
  );
}
