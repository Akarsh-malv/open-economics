"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import type { Course } from "@/types/payload-types";

interface SidebarCourseHeaderProps {
  course: Course;
}

export function SidebarCourseHeader({ course }: SidebarCourseHeaderProps) {
  return (
    <div className="px-5 pb-6 pt-5">
      <Link
        href="/"
        className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black px-4 py-4 text-white shadow-sm transition-colors hover:bg-neutral-900"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Lock className="size-4 shrink-0" />
          <span className="min-w-0">
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold tracking-tight">
              {course.title}
            </span>
            <span className="mt-0.5 block text-xs text-white/55">
              Open Economics
            </span>
          </span>
        </span>
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-black">
          <BrandLogo variant="icon" className="size-9" />
        </span>
      </Link>
    </div>
  );
}
