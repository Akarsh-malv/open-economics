"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/ui";

interface HeaderActionProps {
  onNavigate?: () => void;
  className?: string;
}

function HeaderAction({ onNavigate, className, ...props }: HeaderActionProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "rounded-lg border border-white/15 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white",
        className,
      )}
      {...props}
    >
      <a href="/auth/sign-in" onClick={onNavigate}>
        Sign in
      </a>
    </Button>
  );
}

export function Navbar({ user: _user }: { user: unknown }) {
  const { trigger } = useWebHaptics();
  const [open, setOpen] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  const iconMotionProps: HTMLMotionProps<"div"> = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0.5, scale: 0.8, filter: "blur(4px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0.5, scale: 0.8, filter: "blur(4px)" },
        transition: { duration: 0.14 },
      };

  const backdropMotionProps: HTMLMotionProps<"div"> = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      };

  const menuMotionProps: HTMLMotionProps<"div"> = prefersReducedMotion
    ? {}
    : {
        initial: { y: -10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -10, opacity: 0 },
        transition: { duration: 0.2 },
      };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const handleCoursesClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const coursesLink = target?.closest("[data-nav-courses]");
      if (!coursesLink) return;

      event.preventDefault();
      window.location.href = "/courses";
    };

    document.addEventListener("click", handleCoursesClick, true);
    return () =>
      document.removeEventListener("click", handleCoursesClick, true);
  }, []);

  return (
    <div className="h-[5.5rem]">
      <header
        suppressHydrationWarning
        className={cn(
          "fixed z-50 w-full border-b border-white/10 bg-[#061225]/95 px-5 py-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-colors duration-250 motion-reduce:transition-none motion-reduce:duration-0",
          "safari-ios:backdrop-blur-none!",
        )}
      >
        <div className="mx-auto flex max-w-[1520px] items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="flex items-center"
              aria-label="Open Economics home"
            >
              <BrandLogo
                onDark
                priority
                className="h-11 w-47 sm:h-12 sm:w-64"
              />
            </a>
          </div>

          <div className="relative z-10 hidden items-center gap-6 text-sm font-semibold text-white/88 xl:flex">
            <a
              href="/#about"
              className="pointer-events-auto transition-colors hover:text-blue-200"
            >
              About
            </a>
            <a
              href="/#resources"
              className="pointer-events-auto inline-flex items-center gap-2 transition-colors hover:text-blue-200"
            >
              Resources
              <ChevronDown className="size-4" />
            </a>
            <a
              href="/courses"
              data-nav-courses
              className="pointer-events-auto transition-colors hover:text-blue-200"
            >
              Courses
            </a>
            <a
              href="/practice"
              className="pointer-events-auto transition-colors hover:text-blue-200"
            >
              Practice
            </a>
            <a
              href="/graphs"
              className="pointer-events-auto transition-colors hover:text-blue-200"
            >
              Interactive Graphs
            </a>
            <a
              href="/#contact"
              className="pointer-events-auto transition-colors hover:text-blue-200"
            >
              Contact
            </a>
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden items-center gap-4 xl:flex">
            <button
              type="button"
              aria-label="Search"
              className="grid size-11 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Search className="size-6" />
            </button>
            <HeaderAction />
            <Button
              asChild
              className="h-12 rounded-lg bg-blue-500 px-7 text-base font-bold text-white shadow-[0_12px_28px_rgba(37,99,235,0.26)] hover:bg-blue-400"
            >
              <a href="/courses" data-nav-courses>
                Get started
              </a>
            </Button>
          </div>

          <div className="xl:hidden flex items-center sm:gap-2 gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              className="size-10 cursor-pointer overflow-hidden rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                trigger();
                setOpen((v) => !v);
              }}
            >
              {!mounted ? (
                /* SSR */
                <Menu />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={open ? "close" : "menu"}
                    {...iconMotionProps}
                  >
                    {open ? <X /> : <Menu />}
                  </motion.div>
                </AnimatePresence>
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-16 sm:top-18 z-30 bg-slate-950/60 backdrop-blur-xs"
              {...backdropMotionProps}
            />
            <motion.div
              className="fixed left-4 right-4 top-20 z-40 space-y-4 rounded-3xl border border-white/10 bg-[#061225] p-6 text-white shadow-xl"
              {...menuMotionProps}
            >
              <nav className="flex flex-col gap-3">
                <Link
                  href="/#about"
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
                <Link
                  className="text-lg font-medium"
                  href="/#resources"
                  onClick={() => setOpen(false)}
                >
                  Resources
                </Link>
                <a
                  href="/courses"
                  data-nav-courses
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Courses
                </a>
                <a
                  href="/practice"
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Practice
                </a>
                <a
                  href="/graphs"
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Interactive Graphs
                </a>
                <Link
                  className="text-lg font-medium"
                  href="/#contact"
                  onClick={() => setOpen(false)}
                >
                  Contact
                </Link>

                <div className="border-t border-white/10 pt-6 mt-2 flex flex-col gap-4">
                  <HeaderAction
                    onNavigate={() => setOpen(false)}
                    className="p-5 text-base"
                  />
                  <Button
                    asChild
                    className="h-12 rounded-lg bg-blue-500 text-base font-bold text-white hover:bg-blue-400"
                  >
                    <a
                      href="/courses"
                      data-nav-courses
                      onClick={() => setOpen(false)}
                    >
                      Get started
                    </a>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
