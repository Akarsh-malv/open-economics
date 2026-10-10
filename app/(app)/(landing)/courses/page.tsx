import {
  ArrowRight,
  BookOpen,
  Grid2X2,
  Target,
} from "lucide-react";
import Link from "next/link";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata = buildPublicMetadata({
  title: "Courses",
  description: "Open Economics course pathways.",
  path: "/courses",
});

const coursePaths = [
  {
    title: "AP Microeconomics",
    level: "AP",
    description: "Explore how individuals and firms make decisions in markets.",
    href: "/course/ap-microeconomics",
    units: 6,
    modules: 24,
    examType: "AP Exam",
    alignment: "MCQ & FRQ",
    visual: "micro",
  },
  {
    title: "AP Macroeconomics",
    level: "AP",
    description: "Examine the economy as a whole and the forces that shape it.",
    href: "/course/ap-macroeconomics",
    units: 6,
    modules: 24,
    examType: "AP Exam",
    alignment: "MCQ & FRQ",
    visual: "macro",
  },
  {
    title: "IB Economics SL",
    level: "IB",
    description: "Build a strong foundation in economic theory and real-world applications.",
    href: "/course/sl-economics",
    units: 4,
    modules: 20,
    examType: "IB SL",
    alignment: "Papers 1 & 2",
    visual: "book",
  },
  {
    title: "IB Economics HL",
    level: "IB",
    description: "Dive deeper into advanced topics and analytical skills.",
    href: "/course/hl-economics",
    units: 6,
    modules: 28,
    examType: "IB HL",
    alignment: "Papers 1, 2 & 3",
    visual: "growth",
  },
] as const;

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#071a33]">
      <main className="mx-auto w-full max-w-[1320px] px-5 pb-24 pt-18 sm:px-8 lg:px-10">
        <section className="mb-9">
          <h1 className="text-balance font-serif text-5xl font-black leading-[1.05] tracking-tight text-[#071a33] sm:text-6xl">
            Your learning paths
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-[#536987]">
            Explore our structured courses designed to build your economics knowledge and skills.
          </p>
        </section>

        <section className="space-y-4">
          {coursePaths.map((course) => (
            <CoursePathRow key={course.title} course={course} />
          ))}
        </section>
      </main>
    </div>
  );
}

function CoursePathRow({
  course,
}: {
  course: (typeof coursePaths)[number];
}) {
  return (
    <Link
      href={course.href}
      aria-label={`View ${course.title} pathway`}
      className="group block overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.055)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_26px_82px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d5cab]/15 sm:px-8 sm:py-6"
    >
      <article className="grid items-center gap-7 lg:grid-cols-[190px_minmax(280px,0.95fr)_minmax(0,1.7fr)] xl:grid-cols-[200px_minmax(330px,0.95fr)_minmax(0,1.7fr)]">
        <CourseVisual type={course.visual} />

        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-[#edf4ff] px-3 py-1 text-sm font-black uppercase tracking-[0.22em] text-[#1d5cab]">
            {course.level}
          </p>
          <h2 className="mt-3 text-balance text-2xl font-black leading-tight tracking-tight text-[#071a33]">
            {course.title}
          </h2>
          <p className="mt-3 max-w-[23rem] text-base leading-7 text-[#536987] line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_160px] xl:items-center">
          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            <PathStat icon={BookOpen} value={course.units} label="Units" />
            <PathStat icon={Grid2X2} value={course.modules} label="Modules" />
            <PathStat
              icon={Target}
              value={course.examType}
              label={course.alignment}
            />
          </div>

          <span className="inline-flex h-[3.25rem] w-fit min-w-[160px] items-center justify-center gap-3 rounded-xl bg-[#0b1f3a] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(11,31,58,0.2)] transition-colors group-hover:bg-[#12345c] sm:w-[160px]">
            View Pathway
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}

function PathStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex min-h-[3.15rem] min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-3 py-2 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf4fa] text-[#0b1f3a]">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-black leading-tight text-[#071a33]">
          {value}
        </p>
        <p className="mt-0.5 text-[0.62rem] font-bold uppercase leading-tight tracking-[0.08em] text-[#536987]">
          {label}
        </p>
      </div>
    </div>
  );
}

function CourseVisual({
  type,
}: {
  type: (typeof coursePaths)[number]["visual"];
}) {
  return (
    <div className="grid size-36 place-items-center rounded-full bg-[#eef2f6] ring-1 ring-slate-200/70 sm:size-[10.5rem]">
      <svg
        viewBox="0 0 160 160"
        role="img"
        aria-label="Economics course illustration"
        className="size-32 sm:size-36"
      >
        <circle cx="80" cy="80" r="70" fill="#edf2f7" />
        {type === "micro" && <MicroVisual />}
        {type === "macro" && <MacroVisual />}
        {type === "book" && <BookVisual />}
        {type === "growth" && <GrowthVisual />}
      </svg>
    </div>
  );
}

function MicroVisual() {
  return (
    <>
      <path d="M36 124h88" stroke="#0b1f3a" strokeLinecap="round" strokeWidth="4" />
      <path d="M36 124V38" stroke="#0b1f3a" strokeLinecap="round" strokeWidth="4" />
      <path d="M51 109 113 47" stroke="#7f94b2" strokeLinecap="round" strokeWidth="5" />
      <path d="M51 50 113 112" stroke="#0b1f3a" strokeLinecap="round" strokeWidth="5" />
      <path d="M36 80h46v44" stroke="#d6a23b" strokeDasharray="6 5" strokeWidth="3" />
      <circle cx="82" cy="80" r="5" fill="#d6a23b" />
    </>
  );
}

function MacroVisual() {
  return (
    <>
      <circle cx="86" cy="70" r="43" fill="#cfd9e7" />
      <path
        d="M52 56c20 8 47 8 68 0M49 79c25-7 52-7 78 0M62 38c-10 22-10 43 0 64M103 38c11 22 11 43 0 64"
        fill="none"
        stroke="#f8fafc"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <rect x="33" y="101" width="16" height="25" rx="2" fill="#94a3b8" />
      <rect x="57" y="83" width="20" height="43" rx="2" fill="#64748b" />
      <rect x="86" y="60" width="24" height="66" rx="2" fill="#475569" />
      <path d="M28 127h96" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="3" />
    </>
  );
}

function BookVisual() {
  return (
    <>
      <path
        d="M41 52c18-8 32-4 39 5v66c-9-9-22-13-39-8z"
        fill="#ffffff"
        stroke="#0b1f3a"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M119 52c-18-8-32-4-39 5v66c9-9 22-13 39-8z"
        fill="#ffffff"
        stroke="#0b1f3a"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M80 57v66" stroke="#94a3b8" strokeWidth="3" />
      <path d="M63 116v20l9-6 8 6v-17" fill="#d6a23b" />
      <path d="M64 36h33M57 43h47" stroke="#64748b" strokeLinecap="round" strokeWidth="3" />
    </>
  );
}

function GrowthVisual() {
  return (
    <>
      <path d="M30 118h99" stroke="#0b1f3a" strokeLinecap="round" strokeWidth="3" />
      <rect x="37" y="94" width="15" height="24" rx="2" fill="#94a3b8" />
      <rect x="62" y="78" width="17" height="40" rx="2" fill="#64748b" />
      <rect x="90" y="55" width="20" height="63" rx="2" fill="#475569" />
      <path
        d="M37 77c22-5 43-18 63-40"
        fill="none"
        stroke="#0b1f3a"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path d="m101 37 2 20 15-13z" fill="#0b1f3a" />
      <path
        className="text-[#071a33]"
        d="M36 126h84"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="45" cy="129" r="6" fill="#64748b" />
      <circle cx="70" cy="129" r="6" fill="#64748b" />
      <circle cx="96" cy="129" r="6" fill="#64748b" />
      <circle cx="121" cy="129" r="6" fill="#64748b" />
    </>
  );
}
