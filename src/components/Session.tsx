"use client";

import type { Collections } from "@/server/db";
import { createContext, PropsWithChildren, useContext } from "react";

interface Props extends PropsWithChildren {
  value: Collections["users"]["profile"] | null;
}

const context = createContext<Props["value"]>(null);

export function useProfile() {
  return useContext(context);
}

export default function SessionProvider({ children, value }: Props) {
  return <context.Provider value={value}>{children}</context.Provider>;
}
