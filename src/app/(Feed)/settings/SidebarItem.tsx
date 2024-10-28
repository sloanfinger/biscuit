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
        className="px-3 hover:bg-zinc-900/75 py-2 rounded-md flex gap-6 font-bold"
        data-active={pathname === href || undefined}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
