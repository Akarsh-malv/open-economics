"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui";

interface BuyButtonProps extends React.ComponentProps<typeof Button> {
  courseId: string;
  children?: React.ReactNode;
}

export default function BuyCourseButton({
  courseId,
  children,
  className,
  ...props
}: BuyButtonProps) {
  const href =
    courseId === "course-ap-microeconomics"
      ? "/course/ap-microeconomics"
      : `/course/${courseId}`;

  return (
    <Button className={cn("cursor-pointer", className)} {...props} asChild>
      <Link href={href}>{children ?? "Open Course"}</Link>
    </Button>
  );
}
