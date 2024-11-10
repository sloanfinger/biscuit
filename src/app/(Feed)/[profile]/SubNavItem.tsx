"use client";

import type { Collections } from "@/server/db";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import * as Menu from "@/components/Menu";
import Link from "next/link";

interface Props extends PropsWithChildren {
  path: string;
  profile: Collections["users"]["profile"];
}

export default function SubNavItem({ children, path, profile }: Props) {
  const pathname = usePathname();
  const href = `/@${profile.avatar.username}${path}`;

  return (
    <span
      className={
        pathname === href
          ? "-mb-1.5 border-b-2 border-amber-500 pb-1 text-white"
          : "contents"
      }
    >
      <Menu.Item>
        <Link className="block px-4 py-1.5 hover:text-white" href={href}>
          {children}
        </Link>
      </Menu.Item>
    </span>
  );
}
