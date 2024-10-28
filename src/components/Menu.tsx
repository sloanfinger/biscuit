"use client";

import {
  createContext,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  useCallback,
  useContext,
  useRef
} from "react";

type Exclusive<T extends HTMLElement,K extends keyof DetailedHTMLProps<HTMLAttributes<T>,T>> = Omit<DetailedHTMLProps<HTMLAttributes<T>,T>,K>;

const context = createContext<MouseEventHandler<HTMLLIElement> | null>(null);

export function Root({ children, ...props }: Exclusive<HTMLUListElement,"onMouseLeave">) {
  const shadowRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnterItem = useCallback((e: MouseEvent<HTMLLIElement>) => {
    if (shadowRef.current === null) {
      return;
    }

    const shadow = shadowRef.current;
    const targetBounds = e.currentTarget.getBoundingClientRect();

    shadow.style.opacity = "1";
    shadow.style.top = targetBounds.y.toString() + "px";
    shadow.style.left = targetBounds.x.toString() + "px";
    shadow.style.width = targetBounds.width.toString() + "px";
    shadow.style.height = targetBounds.height.toString() + "px";

    window.requestAnimationFrame(() => {
      shadow.style.transitionProperty = "opacity,width,height,top,left";
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (shadowRef.current === null) {
      return;
    }

    const shadow = shadowRef.current;
    shadow.style.opacity = "0";
    shadow.style.transitionProperty = "opacity";
  }, []);

  return (
    <context.Provider value={handleMouseEnterItem}>
      <ul {...props} onMouseLeave={handleMouseLeave}>
        {children}

        <span
          className="pointer-events-none fixed block rounded-md bg-amber-500/20 duration-200 -z-10 will-change-[top,left,width,height,opacity]"
          ref={shadowRef}
        />
      </ul>
    </context.Provider>
  );
}

export function Item({ children, ...props }: Exclusive<HTMLLIElement,"onMouseEnter">) {
  const handleMouseEnterItem = useContext(context);

  if (handleMouseEnterItem === null) {
    return null;
  }

  return (
    <li {...props} onMouseEnter={handleMouseEnterItem}>
      {children}
    </li>
  );
}
