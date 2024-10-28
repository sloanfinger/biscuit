"use client";

import { signIn } from "@/server/actions";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import {
  PiArrowClockwiseBold,
  PiCircleNotch,
  PiEnvelopeSimpleBold,
  PiLockBold,
  PiSignInBold,
  PiUserPlusBold,
  PiWarningBold,
} from "react-icons/pi";
import { useToast } from "@/components/Toast";

export default function SignIn() {
  const [formState, formAction, isPending] = useActionState(signIn, null);
  const { publish } = useToast();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("verify")) {
      publish({
        className: "bg-red-300 border-red-800 text-red-950",
        duration: 10000,
        icon: PiWarningBold,
        message:
          "Your token is invalid. Try signing in, and we'll send you another.",
      });
      window.history.replaceState(
        null,
        "",
        window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname,
      );
    }
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
    <form
      action={formAction}
      className="flex w-full max-w-lg flex-col items-center gap-9 rounded-lg bg-zinc-900 px-5 py-6 shadow-xl sm:gap-12 sm:px-8 sm:py-12"
    >
      <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>

      <fieldset className="w-full space-y-7">
        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Email
          </span>
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent pl-12 text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            disabled={isPending}
            name="email"
            placeholder="you@email.com"
            required
            type="email"
          />
          <span className="absolute bottom-0 flex flex-col justify-center px-4 pb-2.5 text-2xl text-zinc-500 opacity-60 peer-focus:text-amber-400">
            <PiEnvelopeSimpleBold />
          </span>
        </label>

        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Password
          </span>
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent pl-12 text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            disabled={isPending}
            name="password"
            placeholder="●︎●︎●︎●︎●︎●︎●︎●︎●︎●︎●︎●︎"
            required
            type="password"
          />
          <span className="absolute bottom-0 flex flex-col justify-center px-4 pb-2.5 text-2xl text-zinc-500 opacity-60 peer-focus:text-amber-400">
            <PiLockBold />
          </span>
        </label>
      </fieldset>

      <button
        className="grid w-full rounded-md border-2 border-green-800 bg-gradient-to-b from-green-400 to-green-500 px-6 py-2 text-zinc-950 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
        disabled={isPending}
        role="button"
      >
        <span
          className={`col-span-full row-span-full flex items-center justify-center gap-2 transition-opacity ${isPending ? "opacity-0" : "opacity-100"}`}
        >
          Sign
          <PiSignInBold />
        </span>
        <span
          className={`col-span-full row-span-full flex items-center justify-center gap-2 transition-opacity ${isPending ? "opacity-100" : "opacity-0"}`}
        >
          <PiCircleNotch className="animate-spin [animation-duration:750ms]" />
        </span>
      </button>

      <p className="-mb-2 flex w-full flex-col-reverse items-center justify-between text-zinc-400 sm:-mb-7 sm:mt-3 sm:flex-row">
        <Link
          className="flex items-center justify-center gap-2 bg-underline"
          href="/reset-password"
        >
          <PiArrowClockwiseBold />
          Reset Password
        </Link>
        <Link
          className="flex items-center justify-center gap-2 bg-underline"
          href="/onboarding"
        >
          <PiUserPlusBold />
          Create Account
        </Link>
      </p>
    </form>
  );
}
