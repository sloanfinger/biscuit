"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  trigger?: React.ReactNode;
  control?: boolean;
}

export default function Expandable({ children, control, trigger }: Props) {
  return (
    <Accordion.Root value={control ? "default" : undefined} type="single">
      <Accordion.Item value="default">
        {trigger && <Accordion.Trigger>{trigger}</Accordion.Trigger>}
        <Accordion.Content className="overflow-hidden text-white data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
          {children}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
