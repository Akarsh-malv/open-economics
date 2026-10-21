"use client";

import { type ReactNode, useEffect } from "react";
import { scrollToHeader } from "@/lib/markdown/scroll-to-header";
import { cn } from "@/lib/ui";

interface Props {
  children: ReactNode;
  type: string;
}

export function LessonClientShell({ children, type }: Props) {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        scrollToHeader(hash, { force: true });
      }
    };

    scrollToHash();

    const onHashChange = (e: HashChangeEvent) => {
      e.preventDefault();
      scrollToHash();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <article
      className={cn(
        "mx-auto pb-12 mt-24 px-4 sm:px-6 lg:px-8",
        type === "video" ? "max-w-7xl" : "max-w-6xl",
        "font-manrope",
      )}
    >
      {children}
    </article>
  );
}
