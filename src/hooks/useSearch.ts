import type { Result } from "@/server/actions";
import { useCallback, useRef, useState } from "react";

export default function useSearch<Deps extends unknown[], T>(
  search: (query: string, ...deps: Deps) => Result<T[]>,
  ...deps: Deps
) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [success, setSuccess] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      clearTimeout(dispatch.current);

      dispatch.current = setTimeout(
        (query) => {
          search(query, ...deps)
            .then((result) => {
              if ("error" in result) {
                setSuccess([]);
                setError(result.error);
                return;
              }

              setSuccess(result.success);
              setError(null);
            })
            .catch((error: unknown) => {
              console.error(error);
              setSuccess([]);
              setError("A network error occurred.");
            })
            .finally(() => {
              setIsPending(false);
            });
        },
        500,
        e.currentTarget.value,
      );
    },
    [search, deps],
  );

  return {
    success,
    error,
    isPending,
    handleChange,
  };
}
