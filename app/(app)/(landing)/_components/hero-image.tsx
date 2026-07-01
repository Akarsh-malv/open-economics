import HeroSvgComponent from "@/components/hero-svg";
import { cn } from "@/lib/ui";

interface HeroImageProps {
  className?: string;
}

export function HeroImage({ className }: HeroImageProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        className,
      )}
    >
      <div className="relative w-full h-full">
        <HeroSvgComponent className="absolute top-0 left-0 w-full h-full object-contain" />
      </div>
      <a
        href="https://storyset.com/people"
        target="_blank"
        rel="noopener noreferrer"
        className="sr-only"
      >
        People illustrations by Storyset
      </a>
    </div>
  );
}
