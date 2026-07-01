import {
  ArrowRight,
  Brain,
  Clock,
  LineChart,
  Map,
  MessageCircle,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  buildPublicMetadata,
  getLandingSocialImage,
  SITE_DESCRIPTION,
} from "@/lib/seo";
import { cn } from "@/lib/ui";

export const metadata = buildPublicMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
  images: [getLandingSocialImage()],
});

const features = [
  {
    icon: Brain,
    title: "Clear Lessons",
    description: "Concise explanations designed for clarity.",
  },
  {
    icon: LineChart,
    title: "Interactive Diagrams",
    description: "Practice models like PPC, supply, and demand.",
  },
  {
    icon: Target,
    title: "Exam-Focused Practice",
    description: "Reasoning checks built around assessment language.",
  },
  {
    icon: Map,
    title: "Topic Pathways",
    description: "Move through units with a clear study route.",
  },
  {
    icon: MessageCircle,
    title: "Guided Feedback",
    description: "See why an answer works before moving on.",
  },
  {
    icon: Clock,
    title: "Flexible Review",
    description: "Study one concept or a full course pathway.",
  },
] as const;

const includes = [
  "Text-based lessons",
  "Guided concept walkthroughs",
  "Interactive economics graphs",
  "Practice questions",
  "Course pathways",
  "Review resources",
] as const;

const heroStats = [
  { value: "100+", label: "clear explanations" },
  { value: "25+", label: "graph checkpoints" },
  { value: "4", label: "course pathways" },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-28 px-5 pb-24 pt-3 sm:px-6 lg:px-8">
        <HeroSection />
        <HowItWorks />
        <FeatureSection />
        <FinalCta />
      </main>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-white px-6 py-14 shadow-[0_24px_90px_rgba(15,23,42,0.05)] sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute left-20 top-12 size-24 bg-slate-100/70" />
      <div className="pointer-events-none absolute bottom-20 left-10 size-20 bg-slate-100" />
      <div className="pointer-events-none absolute bottom-8 right-6 size-24 bg-slate-200/50" />

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.78fr)] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0b1f3a]">
            Open Economics
          </p>
          <h1 className="mt-5 text-balance text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl lg:leading-[0.95]">
            Economics, explained{" "}
            <span className="text-[#0b1f3a]">clearly.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-7 text-slate-500">
            A free learning platform built to make economics concepts,
            diagrams, and exam-style reasoning easier to understand.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0b1f3a] px-6 text-white shadow-[0_12px_26px_rgba(11,31,58,0.18)] hover:bg-[#12345c]"
            >
              <Link href="/course/ap-microeconomics">
                Start Learning
                <span className="ml-1 grid size-6 place-items-center rounded-full bg-white">
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-6 text-[#0b1f3a] hover:bg-slate-100"
            >
              <a href="#resources">
                Learn more
                <ArrowRight className="size-4 -rotate-45" />
              </a>
            </Button>
          </div>
        </div>

        <EconomicsHeroImage />
      </div>

      <div className="relative mt-16 grid gap-5 sm:grid-cols-3">
        {heroStats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)]",
              index === 1 &&
                "bg-[#0b1f3a] text-white shadow-[0_18px_50px_rgba(11,31,58,0.18)]",
            )}
          >
            <p className="text-3xl font-extrabold tracking-tight">
              {stat.value}
            </p>
            <p
              className={cn(
                "mt-2 text-sm font-semibold capitalize",
                index === 1 ? "text-white/75" : "text-slate-500",
              )}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EconomicsHeroImage() {
  return (
    <figure className="relative mx-auto w-full max-w-[620px]">
      <svg
        viewBox="0 0 700 610"
        className="h-auto w-full drop-shadow-[0_26px_42px_rgba(15,23,42,0.08)]"
        role="img"
        aria-label="Economics illustration with a rising growth arrow, bar chart, and globe"
      >
        <ellipse cx="210" cy="540" rx="165" ry="22" fill="#d7d7d7" opacity="0.75" />
        <ellipse cx="500" cy="548" rx="120" ry="27" fill="#c7c7c7" opacity="0.75" />

        <polygon points="82,540 158,558 237,530 159,512" fill="#cfcfcf" />
        <polygon points="118,372 178,388 178,540 118,522" fill="#94a3b8" />
        <polygon points="178,388 214,370 214,522 178,540" fill="#64748b" />
        <polygon points="118,372 154,354 214,370 178,388" fill="#cbd5e1" />

        <polygon points="224,300 292,317 292,526 224,508" fill="#64748b" />
        <polygon points="292,317 334,296 334,507 292,526" fill="#475569" />
        <polygon points="224,300 266,279 334,296 292,317" fill="#94a3b8" />

        <polygon points="338,244 408,263 408,516 338,497" fill="#334155" />
        <polygon points="408,263 454,240 454,493 408,516" fill="#1e293b" />
        <polygon points="338,244 383,222 454,240 408,263" fill="#64748b" />

        <polygon points="438,174 506,193 506,498 438,478" fill="#12345c" />
        <polygon points="506,193 552,170 552,474 506,498" fill="#0b1f3a" />
        <polygon points="438,174 484,151 552,170 506,193" fill="#475569" />

        <path
          d="M78 245 L160 168 L230 216 L320 116 L384 165 L484 70"
          fill="none"
          stroke="#0b1f3a"
          strokeWidth="28"
          strokeLinejoin="miter"
        />
        <path
          d="M78 245 L160 168 L230 216 L320 116 L384 165 L484 70"
          fill="none"
          stroke="#12345c"
          strokeWidth="18"
          strokeLinejoin="miter"
        />
        <polygon points="474,42 555,54 542,135" fill="#0b1f3a" />
        <polygon points="485,52 548,61 538,124" fill="#12345c" />

        <circle cx="478" cy="364" r="168" fill="#cbd5e1" />
        <path
          d="M345 295 C382 230 476 186 548 221 C619 254 661 332 633 411 C606 489 522 538 440 521 C354 503 304 423 322 342 C326 325 334 309 345 295Z"
          fill="#b8c3cf"
        />
        <path
          d="M421 222 C452 205 500 206 540 228 C505 238 481 249 453 278 C428 260 416 244 421 222Z"
          fill="#64748b"
        />
        <path
          d="M523 236 C571 243 610 278 626 321 C592 313 572 323 552 351 C530 325 509 302 481 286 C488 260 501 245 523 236Z"
          fill="#94a3b8"
        />
        <path
          d="M383 285 C417 286 439 305 448 336 C418 353 393 379 375 412 C349 387 338 337 353 307 C361 294 371 287 383 285Z"
          fill="#64748b"
        />
        <path
          d="M459 348 C493 341 524 350 544 380 C558 403 550 444 520 475 C493 461 475 442 466 412 C456 383 448 367 459 348Z"
          fill="#475569"
        />
        <path
          d="M570 354 C597 352 618 368 628 393 C618 435 590 472 553 495 C549 460 555 429 571 397 C579 382 578 367 570 354Z"
          fill="#64748b"
        />
        <path
          d="M336 353 C360 364 377 383 385 410 C395 443 384 477 358 497 C332 463 317 420 322 378 C324 368 328 360 336 353Z"
          fill="#475569"
        />
        <path
          d="M392 235 C377 251 367 270 364 292"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="20"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M589 287 C613 317 624 349 622 380"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="478" cy="364" r="168" fill="none" stroke="#64748b" strokeWidth="3" opacity="0.35" />
      </svg>
    </figure>
  );
}

function HowItWorks() {
  return (
    <section id="about" className="scroll-mt-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="How it works"
          title="Learn economics in three simple steps"
          description="Start with a pathway, work through a focused lesson, then check your reasoning with guided practice."
        />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="rounded-[1.4rem] border border-slate-300 bg-white p-5 shadow-[0_24px_65px_rgba(15,23,42,0.08)]">
            <div className="rounded-2xl bg-slate-100 p-6">
              <div className="flex flex-wrap justify-center gap-2">
                {includes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3.5 py-2 text-[11px] font-bold text-slate-600 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="mt-6 text-center text-xl font-extrabold tracking-tight">
              Choose a pathway
            </h3>
          </div>

          <div className="mx-auto h-12 w-[82%] rounded-b-2xl border border-t-0 border-slate-200 bg-white text-center text-sm font-bold leading-[3rem] text-slate-500 shadow-[0_18px_35px_rgba(15,23,42,0.08)]">
            Learn the model
          </div>
          <div className="mx-auto h-10 w-[72%] rounded-b-2xl border border-t-0 border-slate-200 bg-slate-100 text-center text-sm font-bold leading-10 text-slate-500">
            Check reasoning
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-2 hidden h-[calc(100%-1rem)] w-1 rounded-full bg-slate-200 md:block" />
          <div className="space-y-6 md:pl-12">
            {[
              {
                title: "Choose a pathway",
                text: "Select the economics course or topic you want to review.",
                active: true,
              },
              {
                title: "Learn at your pace",
                text: "Work through short explanations and visual models.",
              },
              {
                title: "Check your reasoning",
                text: "Answer focused questions with immediate feedback.",
              },
            ].map((step, index) => (
              <div key={step.title} className="relative">
                <div
                  className={cn(
                    "hidden md:absolute md:-left-[2.85rem] md:top-0 md:block md:size-5 md:rounded-full",
                    step.active ? "bg-[#0b1f3a]" : "bg-slate-300",
                  )}
                />
                <article
                  className={cn(
                    "rounded-xl p-6",
                    step.active
                      ? "bg-[#0b1f3a] text-white shadow-[0_18px_40px_rgba(11,31,58,0.18)]"
                      : "bg-white text-slate-950 shadow-[0_16px_45px_rgba(15,23,42,0.04)]",
                  )}
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-70">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold">{step.title}</h3>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-6",
                      step.active ? "text-white/75" : "text-slate-500",
                    )}
                  >
                    {step.text}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="resources" className="scroll-mt-28 bg-slate-100/70 px-5 py-20 sm:px-8 lg:rounded-[2rem]">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Feature"
          title="Why students should choose this platform"
          description="Open Economics keeps review clear, visual, and focused on how students actually reason through economics."
        />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="min-h-[220px] rounded-xl bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.04)]"
            >
              <Icon className="size-7 text-[#0b1f3a]" />
              <h3 className="mt-16 text-xl font-extrabold tracking-tight text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-[#0b1f3a] px-6 text-white shadow-[0_12px_26px_rgba(11,31,58,0.18)] hover:bg-[#12345c]"
        >
          <Link href="/course/ap-microeconomics">
            Start Learning
            <span className="ml-1 grid size-6 place-items-center rounded-full bg-white">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden rounded-xl bg-[#0b1f3a] px-6 py-16 text-center text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:px-10"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Start with one concept
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          Explore clear explanations, diagrams, and practice built for economics
          students.
        </h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-7 text-[#0b1f3a] hover:bg-slate-100"
          >
            <Link href="/course/ap-microeconomics">Start Learning</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10"
          >
            <a href="#resources">View Resources</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0b1f3a]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
