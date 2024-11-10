"use client";

import type { JWT } from "@/server/auth";
import { createContext, PropsWithChildren, useContext } from "react";

interface Props extends PropsWithChildren {
  value: JWT | null;
}

const context = createContext<Props["value"]>(null);

export function useProfile() {
  return useContext(context);
}

export default function SessionProvider({ children, value }: Props) {
  return <context.Provider value={value}>{children}</context.Provider>;
}
