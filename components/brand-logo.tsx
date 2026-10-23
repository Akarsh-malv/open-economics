import Image from "next/image";
import { cn } from "@/lib/ui";

type BrandLogoProps = {
  variant?: "wordmark" | "icon";
  onDark?: boolean;
  priority?: boolean;
  className?: string;
};

export function BrandLogo({
  variant = "wordmark",
  onDark = false,
  priority = false,
  className,
}: BrandLogoProps) {
  const icon = variant === "icon";

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden",
        icon ? "size-10" : "h-12 w-64",
        className,
      )}
    >
      <Image
        src={icon ? "/brand/symbol-white.svg" : "/brand/lockup-white.svg"}
        alt={icon ? "The Open Economics Project symbol" : "The Open Economics Project"}
        fill
        priority={priority}
        sizes={icon ? "48px" : "(max-width: 640px) 200px, 580px"}
        className={cn("object-contain", !onDark && "brightness-0")}
      />
    </span>
  );
}
