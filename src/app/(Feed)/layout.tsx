import { authorize } from "@/server/auth";
import { type PropsWithChildren } from "react";
import Navigation from "./Navigation";
import SessionProvider from "@/components/Session";

export default async function Header({ children }: PropsWithChildren) {
  return (
    <SessionProvider value={await authorize().catch(() => null)}>
      <div className="z-0 flex h-full min-h-screen flex-col text-white">
        <div className="z-10 w-full px-4">
          <Navigation />
        </div>

        {children}
      </div>
    </SessionProvider>
  );
}
