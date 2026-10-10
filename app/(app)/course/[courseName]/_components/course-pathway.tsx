"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Grid2X2,
  LineChart,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui";

type CoursePathwayCourse = {
  title: string;
  slug: string;
  level: string;
  description: string;
};

type CoursePathwayModule = {
  id: string;
  title: string;
  slug: string;
  href: string;
  description: string;
};

type CoursePathwayUnit = {
  id: string;
  title: string;
  modules: CoursePathwayModule[];
};

type PathwayTab = "content" | "practice";

export function CoursePathway({
  course,
  unitCount,
  moduleCount,
  units,
}: {
  course: CoursePathwayCourse;
  unitCount: number;
  moduleCount: number;
  units: CoursePathwayUnit[];
}) {
  const firstModule = units.find((unit) => unit.modules.length > 0)?.modules[0];
  const [activeTab, setActiveTab] = useState<PathwayTab>("content");
  const [selectedModuleId, setSelectedModuleId] = useState(
    firstModule?.id ?? "",
  );

  const modules = useMemo(() => units.flatMap((unit) => unit.modules), [units]);
  const selectedModule =
    modules.find((module) => module.id === selectedModuleId) ??
    firstModule ??
    null;
  const selectedModuleIndex = Math.max(
    1,
    modules.findIndex((module) => module.id === selectedModule?.id) + 1,
  );

  return (
    <main className="min-h-screen bg-[#f4f6f8] pb-16 text-[#071a33]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-5 py-10 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#b68b2d]">
              Course Pathway
            </p>
            <h1 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#071a33] sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Choose a lesson or switch to practice questions when you are ready
              to review.
            </p>
          </div>
          <div className="hidden grid-cols-3 gap-8 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-center md:grid">
            <CourseTopStat value={unitCount} label="Units" />
            <CourseTopStat value={moduleCount} label="Lessons" />
            <CourseTopStat value={getPracticeCount(units)} label="Practice" />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-1 grid max-w-[1180px] items-start gap-8 px-5 pt-9 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-10">
        <CourseOverviewCard
          course={course}
          unitCount={unitCount}
          moduleCount={moduleCount}
        />

        <section className="min-w-0 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">
                Learning Area
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#071a33]">
                Start where it makes sense
              </h2>
            </div>
            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 p-1">
              <TabButton
                active={activeTab === "content"}
                onClick={() => setActiveTab("content")}
              >
                Content
              </TabButton>
              <TabButton
                active={activeTab === "practice"}
                onClick={() => setActiveTab("practice")}
              >
                Practice Questions
              </TabButton>
            </div>
          </div>

          {activeTab === "content" ? (
            <ContentPathway
              units={units}
              selectedModuleId={selectedModule?.id ?? ""}
              onSelectModule={setSelectedModuleId}
            />
          ) : (
            <PracticePathway courseSlug={course.slug} units={units} />
          )}
        </section>
      </section>

      {selectedModule && activeTab === "content" && (
        <section className="mx-auto mt-8 max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SelectedModulePanel
            module={selectedModule}
            moduleIndex={selectedModuleIndex}
          />
        </section>
      )}
    </main>
  );
}

function CourseOverviewCard({
  course,
  unitCount,
  moduleCount,
}: {
  course: CoursePathwayCourse;
  unitCount: number;
  moduleCount: number;
}) {
  return (
    <aside className="self-start rounded-[1.4rem] border border-slate-200 bg-white px-7 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.06)]">
      <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#2554e8]">
        {course.level}
      </span>

      <h2 className="mt-5 text-balance break-words font-serif text-[2rem] font-black leading-[1.06] tracking-tight text-[#071a33]">
        {course.title}
      </h2>

      <CourseIllustration />

      <p className="mt-7 text-base leading-7 text-slate-600">
        {course.description}
      </p>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <CourseStat icon={BookOpen} value={unitCount} label="Units" />
          <div className="h-12 w-px bg-slate-200" />
          <CourseStat icon={Grid2X2} value={moduleCount} label="Lessons" />
        </div>
      </div>
    </aside>
  );
}

function ContentPathway({
  units,
  selectedModuleId,
  onSelectModule,
}: {
  units: CoursePathwayUnit[];
  selectedModuleId: string;
  onSelectModule: (moduleId: string) => void;
}) {
  return (
    <div className="pt-2">
      {units.map((unit, unitIndex) => (
        <UnitGroup
          key={unit.id}
          unit={unit}
          unitIndex={unitIndex}
          selectedModuleId={selectedModuleId}
          onSelectModule={onSelectModule}
        />
      ))}
    </div>
  );
}

function UnitGroup({
  unit,
  unitIndex,
  selectedModuleId,
  onSelectModule,
}: {
  unit: CoursePathwayUnit;
  unitIndex: number;
  selectedModuleId: string;
  onSelectModule: (moduleId: string) => void;
}) {
  const [open, setOpen] = useState(unitIndex < 2);

  return (
    <section className="border-b border-slate-200 py-7 last:border-b-0 last:pb-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-4 text-left"
        aria-expanded={open}
      >
        <span className="rounded-xl bg-[#0b1f3a] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white">
          Unit {unitIndex + 1}
        </span>
        <span className="min-w-0 flex-1 font-serif text-2xl font-black leading-tight tracking-tight text-[#071a33]">
          {unit.title}
        </span>
        <span className="text-sm font-semibold text-slate-500">
          {open ? "Hide" : "View"}
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-5 space-y-2">
            {unit.modules.map((module, moduleIndex) => (
              <ContentRow
                key={module.id}
                module={module}
                moduleIndex={moduleIndex}
                selected={selectedModuleId === module.id}
                onSelect={() => onSelectModule(module.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentRow({
  module,
  moduleIndex,
  selected,
  onSelect,
}: {
  module: CoursePathwayModule;
  moduleIndex: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border px-4 py-4 transition-colors",
        selected
          ? "border-[#0b1f3a] bg-slate-50"
          : "border-transparent hover:border-slate-200 hover:bg-slate-50",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "grid size-8 place-items-center rounded-full border bg-white transition-colors",
          selected ? "border-[#0b1f3a] text-[#0b1f3a]" : "border-slate-300 text-slate-400",
        )}
        aria-label={`Preview ${module.title}`}
      >
        {selected ? <CheckCircle2 className="size-4" /> : moduleIndex + 1}
      </button>

      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 text-left"
      >
        <p className="truncate text-base font-bold text-[#071a33]">
          {module.title}
        </p>
        <p className="mt-1 truncate text-sm text-slate-500">
          Focused concept lesson
        </p>
      </button>

      <Button
        asChild
        variant="ghost"
        className="h-10 rounded-full px-4 text-sm font-bold text-[#0b1f3a] hover:bg-white hover:text-[#12345c]"
      >
        <Link href={module.href}>
          Start
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function PracticePathway({
  courseSlug,
  units,
}: {
  courseSlug: string;
  units: CoursePathwayUnit[];
}) {
  return (
    <div className="pt-2">
      {units.map((unit, unitIndex) => (
        <section
          key={unit.id}
          className="border-b border-slate-200 py-7 last:border-b-0 last:pb-2"
        >
          <div className="flex items-center gap-4">
            <span className="rounded-xl bg-[#0b1f3a] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white">
              Unit {unitIndex + 1}
            </span>
            <h3 className="min-w-0 flex-1 font-serif text-2xl font-black leading-tight tracking-tight text-[#071a33]">
              {unit.title}
            </h3>
          </div>

          <div className="mt-5 space-y-2">
            {getPracticeTopics(unit, unitIndex).map((topic) => (
              <PracticeRow key={topic.id} courseSlug={courseSlug} topic={topic} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function PracticeRow({
  courseSlug,
  topic,
}: {
  courseSlug: string;
  topic: PracticeTopic;
}) {
  return (
    <Link
      href={`/course/${courseSlug}/${topic.lessonSlug}`}
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-transparent px-4 py-4 transition-colors hover:border-slate-200 hover:bg-slate-50"
    >
      <span className="grid size-8 place-items-center rounded-full border border-slate-300 bg-white text-[#0b1f3a]">
        <CircleHelp className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-bold text-[#071a33]">
          {topic.title}
        </span>
        <span className="mt-1 block truncate text-sm text-slate-500">
          {topic.kind}
        </span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 group-hover:text-[#0b1f3a]">
        {topic.questions} questions
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

function SelectedModulePanel({
  module,
  moduleIndex,
}: {
  module: CoursePathwayModule;
  moduleIndex: number;
}) {
  return (
    <article className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:flex sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#2554e8]">
          Module {moduleIndex}
        </p>
        <h3 className="mt-3 text-pretty font-serif text-2xl font-black leading-tight tracking-tight text-[#071a33]">
          {module.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {module.description}
        </p>
      </div>
      <Button
        asChild
        size="lg"
        className="mt-6 h-12 rounded-full bg-[#0b1f3a] px-7 text-base font-bold text-white hover:bg-[#12345c] sm:mt-0"
      >
        <Link href={module.href}>
          Start Lesson
          <ArrowRight className="size-5" />
        </Link>
      </Button>
    </article>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-extrabold transition-colors",
        active
          ? "bg-[#0b1f3a] text-white shadow-sm"
          : "text-slate-500 hover:text-[#0b1f3a]",
      )}
    >
      {children}
    </button>
  );
}

function CourseTopStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-serif text-3xl font-black leading-none text-[#071a33]">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function CourseStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-[#0b1f3a]">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-serif text-3xl font-black leading-none text-[#071a33]">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}

function CourseIllustration() {
  return (
    <div className="mt-8 flex justify-center">
      <svg
        viewBox="0 0 310 255"
        className="h-auto w-full max-w-[250px]"
        role="img"
        aria-label="Economics globe and growth bars"
      >
        <ellipse cx="150" cy="225" rx="132" ry="18" fill="#e2e8f0" />
        <circle cx="168" cy="111" r="82" fill="#dbe4f0" />
        <path
          d="M94 80c24-34 78-50 118-24 40 26 51 87 18 123-29 33-82 36-118 8-35-27-41-74-18-107z"
          fill="#c9d5e6"
        />
        <path
          d="M111 68c19 13 48 15 72 7M106 110c44-7 87-5 128 9M118 166c33-12 70-13 104-1"
          stroke="#f8fafc"
          strokeLinecap="round"
          strokeWidth="8"
          opacity="0.75"
        />
        <rect x="58" y="174" width="34" height="52" rx="3" fill="#94a3b8" />
        <rect x="105" y="151" width="41" height="75" rx="3" fill="#64748b" />
        <rect x="162" y="116" width="47" height="110" rx="3" fill="#475569" />
        <path
          d="M48 226h178"
          stroke="#cbd5e1"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M72 80l34-28 41 19 48-43"
          fill="none"
          stroke="#0b1f3a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <LineChart className="hidden" />
      </svg>
    </div>
  );
}

type PracticeTopic = {
  id: string;
  title: string;
  kind: string;
  questions: number;
  lessonSlug: string;
};

function getPracticeTopics(
  unit: CoursePathwayUnit,
  unitIndex: number,
): PracticeTopic[] {
  const fallbackSlug = unit.modules[0]?.slug ?? "scarcity-and-economic-thinking";
  const firstThree = unit.modules.slice(0, 3);

  if (firstThree.length > 0) {
    return firstThree.map((module, index) => ({
      id: `${unit.id}-${module.id}-practice`,
      title: `${module.title} Practice`,
      kind: index === 0 ? "Concept check" : index === 1 ? "Graph practice" : "Exam-style set",
      questions: 8 + index * 2 + unitIndex,
      lessonSlug: module.slug || fallbackSlug,
    }));
  }

  return [
    {
      id: `${unit.id}-review`,
      title: `${unit.title} Review`,
      kind: "Mock question set",
      questions: 10,
      lessonSlug: fallbackSlug,
    },
  ];
}

function getPracticeCount(units: CoursePathwayUnit[]) {
  return units.reduce((count, unit, index) => count + getPracticeTopics(unit, index).length, 0);
}
