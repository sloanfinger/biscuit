import Logo from "@/components/Logo";
import { type PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex w-full items-center justify-center px-4 py-6">
        <Logo />
      </header>
      <main className="flex flex-grow flex-col items-center justify-center gap-2 px-4">
        {children}
      </main>
    </div>
  );
}
