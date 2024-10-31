"use client";

import { createAccount, validateUsername } from "@/server/actions/users";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import {
  type ChangeEvent,
  useActionState,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import {
  PiArrowRightBold,
  PiAtBold,
  PiCheckBold,
  PiCheckCircleBold,
  PiCircleNotch,
  PiCircleNotchBold,
  PiEnvelopeSimpleBold,
  PiLockBold,
  PiSignInBold,
  PiWarningBold,
  PiXBold,
} from "react-icons/pi";
import { useToast } from "@/components/Toast";

interface Validation {
  key: string;
  message: string;
  state: "valid" | "invalid" | "pending";
}

export default function CreateAccount() {
  const [formState, formAction, isPending] = useActionState(
    createAccount,
    null,
  );
  const { publish } = useToast();
  const [validation, setValidation] = useReducer(
    (
      state: Validation | null,
      action: (Validation & { input: HTMLInputElement & EventTarget }) | null,
    ) => {
      if (state === null || action === null || action.state === "pending") {
        return action;
      }

      if (state.key !== action.key) {
        return state;
      }

      action.input.setCustomValidity(
        action.state === "invalid" ? action.message : "",
      );
      return action;
    },
    null,
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const value = target.value;
    setValidation({
      input: target,
      key: value,
      message: "Checking username...",
      state: "pending",
    });

    if (value.length === 0) {
      setValidation(null);
      return;
    }

    if (!/^[a-z_]/i.test(value)) {
      setValidation({
        input: target,
        key: value,
        message: "Usernames must start a with letter or underscore.",
        state: "invalid",
      });
      return;
    }

    if (!/^[a-z_][0-9a-z_]*$/i.test(value)) {
      setValidation({
        input: target,
        key: value,
        message: "Only letters, numbers, and underscores are allowed.",
        state: "invalid",
      });
      return;
    }

    if (value.length < 4) {
      setValidation({
        input: target,
        key: value,
        message: "Username is too short.",
        state: "invalid",
      });
      return;
    }

    if (value.length > 16) {
      setValidation({
        input: target,
        key: value,
        message: "Username is too long.",
        state: "invalid",
      });
      return;
    }

    validateUsername(value)
      .then((result) => {
        if ("error" in result) {
          setValidation({
            input: target,
            key: value,
            message: result.error,
            state: "invalid",
          });
          return;
        }

        setValidation({
          input: target,
          key: value,
          message: "Looks good!",
          state: "valid",
        });
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (formState === null) {
      return;
    }

    if ("success" in formState) {
      publish({
        className: "bg-green-300 border-green-800 text-green-950",
        icon: PiCheckCircleBold,
        message: formState.success,
      });
      return;
    }

    publish({
      className: "bg-red-300 border-red-800 text-red-950",
      icon: PiWarningBold,
      message: formState.error,
    });
  }, [formState]);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-lg flex-col items-center gap-9 rounded-lg bg-zinc-900 px-5 py-6 shadow-xl sm:gap-12 sm:px-8 sm:py-12"
    >
      <h2 className="text-3xl font-bold text-white">Create Account</h2>

      <fieldset className="w-full space-y-7">
        <label className="w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Username
          </span>

          <span className="relative block">
            <input
              autoComplete="off"
              className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent pl-12 lowercase text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
              disabled={isPending}
              maxLength={16}
              minLength={4}
              name="username"
              onChange={handleChange}
              placeholder="your_unique_username"
              required
              type="text"
            />
            <span className="absolute bottom-0 flex flex-col justify-center px-4 pb-2.5 text-2xl text-zinc-500 opacity-60 peer-focus:text-amber-400">
              <PiAtBold />
            </span>
          </span>

          <Accordion.Root
            value={validation !== null ? "open" : undefined}
            type="single"
            asChild
          >
            <span className="block">
              <Accordion.Item value="open" asChild>
                <span
                  className={
                    validation?.state === "valid"
                      ? "text-green-500"
                      : validation?.state === "invalid"
                        ? "text-red-500"
                        : "text-zinc-500"
                  }
                >
                  <Accordion.Content asChild>
                    <span className="flex w-full justify-end overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                      <span className="flex w-full items-center justify-end gap-3">
                        <span className="block text-lg">
                          {validation?.state === "valid" ? (
                            <PiCheckBold />
                          ) : validation?.state === "invalid" ? (
                            <PiXBold />
                          ) : (
                            <span className="block animate-spin [animation-duration:500ms]">
                              <PiCircleNotchBold />
                            </span>
                          )}
                        </span>
                        <span className="leading-tight">
                          {validation?.message ?? "Checking username..."}
                        </span>
                      </span>
                    </span>
                  </Accordion.Content>
                </span>
              </Accordion.Item>
            </span>
          </Accordion.Root>
        </label>

        <label className="relative block w-full space-y-1.5">
          <span className="block text-sm font-bold uppercase text-white">
            Email
          </span>
          <input
            autoComplete="email"
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent pl-12 lowercase text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
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
            minLength={8}
            name="password"
            placeholder="●︎●︎●︎●︎●︎●︎●︎●︎●︎●︎●︎●︎"
            required
            type="password"
          />
          <span className="absolute bottom-0 flex flex-col justify-center px-4 pb-2.5 text-2xl text-zinc-500 opacity-60 peer-focus:text-amber-400">
            <PiLockBold />
          </span>
        </label>

        <label className="flex items-center gap-4 pt-1.5">
          <input
            className="form-checkbox h-6 w-6 rounded-sm border-2 bg-zinc-900 text-green-600 transition-colors hover:bg-zinc-700"
            name="tos"
            required
            type="checkbox"
          />
          <span className="text-white">
            I understand and agree to the{" "}
            <Link href="/legal" className="bg-underline" target="_blank">
              Terms of Service
            </Link>
            .
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
          Continue
          <PiArrowRightBold />
        </span>
        <span
          className={`col-span-full row-span-full flex items-center justify-center gap-2 transition-opacity ${isPending ? "opacity-100" : "opacity-0"}`}
        >
          <PiCircleNotch className="animate-spin [animation-duration:750ms]" />
        </span>
      </button>

      <p className="-mb-2 flex w-full flex-col-reverse items-center justify-center text-zinc-400 sm:-mb-7 sm:mt-3 sm:flex-row">
        <Link
          className="flex items-center justify-center gap-2 bg-underline"
          href="/login"
        >
          Already have an Account? Sign In
          <PiSignInBold />
        </Link>
      </p>
    </form>
  );
}
