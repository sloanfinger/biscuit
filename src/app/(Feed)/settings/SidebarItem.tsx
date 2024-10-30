"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  href: ComponentProps<typeof Link>["href"];
}

export default function SidebarItem({ children, href }: Props) {
  const pathname = usePathname();

  return (
    <li className="contents">
      <Link
        className="flex gap-6 rounded-md px-3 py-2 font-bold hover:bg-zinc-900/75"
        data-active={pathname === href || undefined}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
