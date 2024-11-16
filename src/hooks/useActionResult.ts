import { useToast } from "@/components/Toast";
import { Result } from "@/server/actions";
import { isRedirectError } from "next/dist/client/components/redirect";
import { startTransition, useCallback, useOptimistic, useState } from "react";
import { PiWarningBold } from "react-icons/pi";

/**
 * Similar to React's `useActionState()`. This hook also allows for optimistic updates and pushes a toast notification on error states.
 * @param action A server action that returns a `Result`.
 * @param initialState The initial state for the server action.
 * @param optimisticUpdate If specified, it will update the state using the calculated optimistic value before the server sends a result.
 * @returns The most recent successful state, a trigger for starting the action, and a pending flag.
 */
export default function useActionResult<S, D extends unknown[]>(
  action: (state: S, ...data: D) => Result<S>,
  initialState: S,
  optimisticUpdate?: (state: S, ...data: D) => S,
) {
  const { publish } = useToast();
  const [state, setState] = useState<S>(initialState);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [optimisticState, updateOptimisticState] = useOptimistic(
    state,
    (state: S, data: D) =>
      optimisticUpdate ? optimisticUpdate(state, ...data) : state,
  );

  const trigger = useCallback(
    (...data: D) => {
      setIsPending(true);
      startTransition(() => {
        updateOptimisticState(data);
        action(state, ...data)
          .then((result) => {
            if ("error" in result) {
              throw new Error(result.error);
            }

            setState(result.success);
          })
          .catch((error: unknown) => {
            if (isRedirectError(error)) {
              throw error;
            }

            publish({
              className: "bg-red-300 border-red-800 text-red-950",
              icon: PiWarningBold,
              message: (error as Error).message,
            });
          })
          .finally(() => {
            setIsPending(false);
          });
      });
    },
    [state],
  );

  return [optimisticState, trigger, isPending] as const;
}
