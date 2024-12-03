"use client";

import RatingInput from "@/components/RatingInput";
import { useToast } from "@/components/Toast";
import type { Release } from "@/server/actions/itunes";
import { createReview } from "@/server/actions/reviews";
import Image from "next/image";
import {
  ChangeEvent,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  PiCircleNotch,
  PiFloppyDiskBackBold,
  PiPaperPlaneTiltBold,
  PiWarningBold,
} from "react-icons/pi";

interface Props {
  defaultValue: {
    rating: number;
    content: string;
    shouldPublish: boolean;
  };
  release: Release;
}

export default function Editor({ defaultValue, release }: Props) {
  const [formState, formAction, isPending] = useActionState(createReview, null);
  const [shouldPublish, setShouldPublish] = useState(
    defaultValue.shouldPublish,
  );
  const { publish } = useToast();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setShouldPublish(e.currentTarget.checked);
  }, []);

  useEffect(() => {
    if (formState !== null) {
      publish({
        className: "bg-red-300 border-red-800 text-red-950",
        icon: PiWarningBold,
        message: formState.error,
      });
    }
  }, [formState]);

  return (
    <form className="contents" action={formAction}>
      <h2 className="contents">
        <figure className="flex w-full items-center gap-6">
          <span className="relative size-20 md:size-25 lg:size-28 overflow-hidden rounded-sm">
            {release.artworkUrl100 && (
              <Image
                alt=""
                className="absolute inset-0 size-full object-cover"
                src={release.artworkUrl100.replace("100x100", "256x256")}
                height={112}
                width={112}
              />
            )}
          </span>
          <figcaption className="flex flex-1 flex-col gap-1">
            <span className="md:text-lg lg:text-3xl font-bold text-white">
              {release.collectionName}
            </span>
            <span className="text-md md:text-lg lg:text-xl text-zinc-400">{release.artistName}</span>
          </figcaption>
        </figure>
      </h2>

      <hr className="h-[3px] w-full rounded-full border-none bg-zinc-600" />

      <fieldset className="contents">
        <input
          className="hidden"
          name="releaseId"
          value={release.collectionId}
          readOnly
        />
        <input
          className="hidden"
          name="artistId"
          value={release.artistId}
          readOnly
        />

        <RatingInput defaultValue={defaultValue.rating} />

        <label className="relative block mx-auto w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Review
          </span>
          <textarea
            className="peer form-input w-full p-2 rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={defaultValue.content}
            disabled={isPending}
            name="content"
            placeholder="Lorem ipsum dolor, sit amet consectetur adipisicing elit..."
            rows={3}
          />
        </label>

        <label className="flex items-center gap-4 lg:self-start pb-1">
          <input
            className="form-checkbox h-6 w-6 rounded-sm border-2 bg-zinc-900 text-orange-700 transition-colors hover:bg-zinc-700"
            checked={shouldPublish}
            onChange={handleChange}
            name="shouldPublish"
            type="checkbox"
          />
          <span className="text-white text-sm lg:text-base">Publish Review to Profile</span>
        </label>

        <button
          className="grid md:w-1/3 lg:w-full rounded-md border-2 border-amber-800 bg-gradient-to-b from-amber-400 to-amber-500 px-8 py-2.5 text-lg text-amber-950 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
          disabled={isPending}
          role="button"
        >
          <span
            className={`col-span-full row-span-full flex items-center justify-center gap-2 transition-opacity ${isPending ? "opacity-0" : "opacity-100"}`}
          >
            {shouldPublish ? (
              <>
                Publish
                <PiPaperPlaneTiltBold />
              </>
            ) : (
              <>
                <PiFloppyDiskBackBold />
                Save as Draft
              </>
            )}
          </span>
          <span
            className={`col-span-full row-span-full flex items-center justify-center transition-opacity ${isPending ? "opacity-100" : "opacity-0"}`}
          >
            <PiCircleNotch className="animate-spin [animation-duration:750ms]" />
          </span>
        </button>
      </fieldset>
    </form>
  );
}
