"use client";

import { useRouter } from "next/navigation";
import { PiArrowLeftBold } from "react-icons/pi";

export default function Back() {
  const router = useRouter();

  return (
    <p className="-mb-2 flex w-full flex-col-reverse items-center justify-between text-zinc-400 sm:flex-row">
      <button
        className="flex items-center justify-center gap-2 bg-underline"
        onClick={() => {
          router.back();
        }}
        type="button"
      >
        <PiArrowLeftBold />
        Go Back
      </button>
    </p>
  );
}
