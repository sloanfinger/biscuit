"use client";

import * as Toast from "@radix-ui/react-toast";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { type IconType } from "react-icons";

interface Props {
  className: string;
  duration?: number;
  icon: IconType;
  message: string;
}

const context = createContext<{ publish: (props: Props) => void } | null>(null);

export function useToast() {
  const handle = useContext(context);

  if (handle === null) {
    throw new Error(
      "`useToast` can only be called in a component which is a child of a `<ToastProvider />`.",
    );
  }

  return handle;
}

export default function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Props[]>([]);
  const handle = useMemo(
    () => ({
      publish: (props: Props) => {
        setToasts((toasts) => [...toasts, props]);
      },
    }),
    [setToasts],
  );

  return (
    <context.Provider value={handle}>
      <Toast.Provider swipeDirection="right">
        {children}
        {toasts.map(
          ({ className, duration = 6000, icon: Icon, message }, index) => (
            <Toast.Root
              className={`flex w-full items-center justify-center gap-5 rounded-lg border-2 px-6 py-4 text-black shadow-lg data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out] ${className}`}
              duration={duration}
              key={index}
            >
              <Icon className="text-2xl opacity-60" />
              <Toast.Description className="flex-1 text-lg leading-tight">
                {message}
              </Toast.Description>
            </Toast.Root>
          ),
        )}
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[32rem] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </context.Provider>
  );
}
