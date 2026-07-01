"use client";

import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/ui";

interface HeaderActionProps {
  onNavigate?: () => void;
  className?: string;
}

function HeaderAction({
  onNavigate,
  className,
  ...props
}: HeaderActionProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "rounded-full px-5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-[#0b1f3a]",
        className,
      )}
      {...props}
    >
      <a href="/#contact" onClick={onNavigate}>
        Contact
      </a>
    </Button>
  );
}

export function Navbar({ user: _user }: { user: unknown }) {
  const { trigger } = useWebHaptics();
  const [open, setOpen] = useState<boolean>(false);
  const [atTop, setAtTop] = useState<boolean>(true);

  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  const showBorder = !atTop || open;

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
    const handleScroll = () => setAtTop(window.scrollY < 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    return () => document.removeEventListener("click", handleCoursesClick, true);
  }, []);

  return (
    <div className="mb-8">
      <header
        suppressHydrationWarning
        className={cn(
          "fixed z-50 w-full px-4 py-4 transition-colors duration-250 motion-reduce:transition-none motion-reduce:duration-0",
          "safari-ios:backdrop-blur-none!",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-slate-200 bg-white/92 px-4 py-2.5 shadow-[0_14px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl",
            showBorder && "border-slate-300",
            open && "bg-white",
          )}
        >
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-xs font-black text-[#0b1f3a]">
                OE
              </span>
              <span className="text-lg font-extrabold tracking-tight text-[#0b1f3a]">
                Open Economics
              </span>
            </a>
            <div className="relative z-10 hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
              <a
                href="/#about"
                className="pointer-events-auto transition-colors hover:text-[#0b1f3a]"
              >
                About
              </a>
              <a
                href="/courses"
                data-nav-courses
                className="pointer-events-auto transition-colors hover:text-[#0b1f3a]"
              >
                Courses
              </a>
            </div>
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden items-center gap-5 md:flex">
            <HeaderAction />
          </div>

          <div className="md:hidden flex items-center sm:gap-2 gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-10 cursor-pointer overflow-hidden rounded-full border-slate-200 bg-slate-50"
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
              className="fixed inset-x-0 bottom-0 top-16 sm:top-18 z-30 bg-slate-950/10 backdrop-blur-xs"
              {...backdropMotionProps}
            />
            <motion.div
              className="fixed left-4 right-4 top-20 z-40 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
              {...menuMotionProps}
            >
              <nav className="flex flex-col gap-3">
                <a
                  className="text-lg font-medium"
                  href="/#about"
                  onClick={() => setOpen(false)}
                >
                  About
                </a>
                <a
                  className="text-lg font-medium"
                  href="/courses"
                  data-nav-courses
                  onClick={() => setOpen(false)}
                >
                  Courses
                </a>

                <div className="border-t border-slate-200 pt-6 mt-2 flex flex-col gap-4">
                  <HeaderAction
                    onNavigate={() => setOpen(false)}
                    className="p-5 text-base"
                  />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
