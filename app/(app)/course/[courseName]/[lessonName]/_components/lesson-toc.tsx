"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollShadow } from "@/components/scroll-shadow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollShadows } from "@/hooks/use-scroll-shadows";
import type { Heading } from "@/lib/markdown/extract-headings";
import { scrollToHeader } from "@/lib/markdown/scroll-to-header";
import { cn } from "@/lib/ui";

function useActiveHeading(ids: string[], enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const suppressUntil = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !ids?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntil.current) return;

        const visible: { id: string; distance: number }[] = [];

        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.push({
              id: entry.target.id,
              distance: entry.boundingClientRect.top,
            });
          }
        }

        if (visible.length) {
          const closest = visible.reduce((a, b) =>
            Math.abs(b.distance) < Math.abs(a.distance) ? b : a,
          );
          setActiveId(closest.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      }
    };
  }, [ids, enabled]);

  const forceActive = useCallback((id: string) => {
    suppressUntil.current = Date.now() + 1000;
    setActiveId(id);
  }, []);

  return { activeId, forceActive };
}

export function LessonTOC({ headings }: { headings: Heading[] }) {
  const isDesktop = useMediaQuery("(min-width: 1180px)");
  const itemIds = useMemo(() => headings.map((h) => h.id), [headings]);
  const { activeId, forceActive } = useActiveHeading(itemIds, isDesktop);
  const {
    ref: scrollRef,
    showTop,
    showBottom,
  } = useScrollShadows<HTMLDivElement>({
    topOffset: 24,
    bottomOffset: 0,
  });

  const tocItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    if (!isDesktop || !activeId) return;
    const el = tocItemRefs.current.get(activeId);
    const container = scrollRef.current;
    if (!el || !container) return;

    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const margin = 80;

    if (elTop - margin < containerTop) {
      container.scrollTo({ top: elTop - margin, behavior: "smooth" });
    } else if (elBottom + margin > containerBottom) {
      container.scrollTo({
        top: elBottom + margin - container.clientHeight,
        behavior: "smooth",
      });
    }
  }, [activeId, isDesktop, scrollRef.current]);

  if (headings.length <= 1) return null;

  const handleClick = (id: string) => {
    forceActive(id);
    scrollToHeader(id);
  };

  return (
    <aside className="lesson-toc hidden min-[1180px]:block font-inter">
      <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-sm">
        <div className="relative">
          <div className="overflow-y-auto max-h-[70vh] pr-1" ref={scrollRef}>
            <p className="text-[11px] font-semibold mb-4 uppercase tracking-[0.18em] text-slate-400">
              In this lesson
            </p>
            <div className="space-y-1.5">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  ref={(el) => {
                    if (el) tocItemRefs.current.set(h.id, el);
                    else tocItemRefs.current.delete(h.id);
                  }}
                  onClick={() => handleClick(h.id)}
                  data-active={activeId === h.id}
                  className={cn(
                    "group flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm leading-snug transition-colors",
                    h.level === 3 && "ml-3",
                    activeId === h.id
                      ? "bg-blue-500/10 text-blue-200"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full transition-colors",
                      activeId === h.id
                        ? "bg-blue-400"
                        : "bg-slate-600 group-hover:bg-slate-400",
                    )}
                  />
                  <span className="line-clamp-3">{h.text}</span>
                </a>
              ))}
            </div>
          </div>
          <ScrollShadow show={showTop} position="top" className="h-12" />
          <ScrollShadow show={showBottom} position="bottom" className="h-12" />
        </div>
      </div>
    </aside>
  );
}
