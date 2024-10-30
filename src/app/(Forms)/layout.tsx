import Logo from "@/components/Logo";
import { type PropsWithChildren } from "react";

export default function FormLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-[100dvh] flex-col gap-6 py-6">
      <header className="flex w-full items-center justify-center px-4">
        <Logo />
      </header>
      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4">
        {children}
      </main>
    </div>
  );
}
