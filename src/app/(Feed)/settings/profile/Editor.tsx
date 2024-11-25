"use client";

import { updateAccount } from "@/server/actions/users";
import { useActionState, useState } from "react";
import { PiCircleNotch } from "react-icons/pi";

interface Props {
  defaultValue: {
    username: string;
    email: string;
    bio: string;
    avatarImage: string;
    bannerImage: string;
    displayName: string;
    password: string;
  };
}

export default function Editor({ defaultValue }: Props) {
  const [_formState, formAction, isPending] = useActionState(
    updateAccount,
    null,
  );
  const [passwordValue, setPasswordValue] = useState("");

  function passwordValueUpdateHandler(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setPasswordValue(event.target.value);
  }

  const isPasswordBoxEdited = passwordValue.length > 0;
  const canEditConfirmPassword = isPasswordBoxEdited && !isPending;

  let avatarImageURL = defaultValue.avatarImage;
  let bannerImageURL = defaultValue.bannerImage;

  if (avatarImageURL === "https://picsum.photos/128/128") {
    avatarImageURL = "";
  }

  if (bannerImageURL === "https://picsum.photos/seed/3/1280/720") {
    bannerImageURL = "";
  }

  return (
    <form className="contents" action={formAction}>
      <fieldset className="contents">
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Username (must be between 4 and 16 characters):
          </span>
          <textarea
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={defaultValue.username}
            disabled={isPending}
            name="username"
            placeholder="Ex: someone123"
            maxLength={16}
            minLength={4}
            rows={1}
          />
        </label>
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Display Name (must be between 4 and 16 characters):
          </span>
          <textarea
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={defaultValue.displayName}
            disabled={isPending}
            maxLength={16}
            minLength={4}
            name="displayName"
            placeholder="Ex: someone123"
            rows={1}
          />
        </label>
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Email:
          </span>
          <textarea
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={defaultValue.email}
            disabled={isPending}
            name="email"
            placeholder="you@email.com"
            rows={1}
          />
        </label>
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Bio:
          </span>
          <textarea
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={defaultValue.bio}
            disabled={isPending}
            name="bio"
            placeholder="Tell us about yourself!"
            rows={3}
          />
        </label>
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Avatar Picture (URL):
          </span>
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={avatarImageURL}
            disabled={isPending}
            name="avatarImageURL"
            placeholder="Put a URL to an image here."
            type="url"
          />
        </label>
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Banner Picture (URL):
          </span>
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={bannerImageURL}
            disabled={isPending}
            name="bannerImageURL"
            type="url"
            placeholder="Put a URL to an image here."
          />
        </label>

        <hr className="my-8 h-[3px] w-full rounded-full border-none bg-zinc-600" />

        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Change Password:
          </span>
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            disabled={isPending}
            value={passwordValue}
            onChange={passwordValueUpdateHandler}
            minLength={8}
            name="password"
            placeholder="Put your new desired password here"
            type="password"
          />
        </label>
        <label className="relative mt-[8px] block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Confirm (Current) Password:
          </span>
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            defaultValue={""}
            disabled={!canEditConfirmPassword}
            name="confirmedPassword"
            placeholder="Confirm your current password here."
            type="password"
          />
        </label>
        <button
          className={`mt-[8px] grid w-full rounded-md border-2 px-8 py-2.5 text-lg disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto ${
            isPending
              ? "border-gray-800 bg-gradient-to-b from-gray-400 to-gray-500 text-gray-950"
              : "border-amber-800 bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950"
          }`}
          disabled={isPending}
          role="button"
        >
          <span
            className={`col-span-full row-span-full flex items-center justify-center gap-2 transition-opacity ${isPending ? "opacity-0" : "opacity-100"}`}
          >
            <p>Update</p>
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
