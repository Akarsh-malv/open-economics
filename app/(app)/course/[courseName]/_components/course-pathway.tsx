"use client";

import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Grid2X2,
  LineChart,
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
  const [selectedModuleId, setSelectedModuleId] = useState(
    firstModule?.id ?? "",
  );
  const [openUnitIds, setOpenUnitIds] = useState<string[]>(() =>
    units.map((unit) => unit.id),
  );

  const selectedModule = useMemo(
    () =>
      units
        .flatMap((unit) => unit.modules)
        .find((module) => module.id === selectedModuleId) ??
      firstModule ??
      null,
    [firstModule, selectedModuleId, units],
  );

  const selectedModuleIndex = useMemo(() => {
    const modules = units.flatMap((unit) => unit.modules);
    return Math.max(
      1,
      modules.findIndex((module) => module.id === selectedModule?.id) + 1,
    );
  }, [selectedModule?.id, units]);

  const toggleUnit = (unitId: string) => {
    setOpenUnitIds((current) =>
      current.includes(unitId)
        ? current.filter((id) => id !== unitId)
        : [...current, unitId],
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 pb-16 pt-9 text-[#071a33] sm:px-8 lg:px-10">
      <section className="mx-auto grid max-w-[1368px] items-start gap-10 lg:grid-cols-[430px_minmax(0,1fr)] xl:grid-cols-[450px_minmax(0,1fr)]">
        <CourseOverviewCard
          course={course}
          unitCount={unitCount}
          moduleCount={moduleCount}
        />

        <section className="rounded-[1.4rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_22px_80px_rgba(15,23,42,0.06)] sm:px-8 lg:px-10">
          <div className="relative min-w-0">
            <div className="min-w-0 xl:pb-80">
              {units.map((unit, unitIndex) => (
                <CourseUnitSection
                  key={unit.id}
                  unit={unit}
                  unitIndex={unitIndex}
                  open={openUnitIds.includes(unit.id)}
                  selectedModuleId={selectedModule?.id ?? ""}
                  onToggle={() => toggleUnit(unit.id)}
                  onSelectModule={setSelectedModuleId}
                />
              ))}
            </div>

            {selectedModule && (
              <SelectedModuleCard
                module={selectedModule}
                moduleIndex={selectedModuleIndex}
              />
            )}
          </div>
        </section>
      </section>
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
    <aside className="self-start rounded-[1.4rem] border border-slate-200 bg-white px-8 py-9 shadow-[0_22px_80px_rgba(15,23,42,0.06)] sm:px-10">
      <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#2554e8]">
        {course.level}
      </span>

      <h1 className="mt-6 text-balance break-words font-serif text-[2.1rem] font-black leading-[1.08] tracking-tight text-[#071a33] sm:text-[2.35rem] xl:text-[2.55rem]">
        {course.title}
      </h1>

      <CourseIllustration />

      <p className="mt-7 max-w-sm text-lg leading-8 text-slate-600">
        {course.description}
      </p>

      <div className="mt-9 border-t border-slate-200 pt-7">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5">
          <CourseStat icon={BookOpen} value={unitCount} label="Units" />
          <div className="h-12 w-px bg-slate-200" />
          <CourseStat icon={Grid2X2} value={moduleCount} label="Modules" />
        </div>
      </div>
    </aside>
  );
}

function CourseUnitSection({
  unit,
  unitIndex,
  open,
  selectedModuleId,
  onToggle,
  onSelectModule,
}: {
  unit: CoursePathwayUnit;
  unitIndex: number;
  open: boolean;
  selectedModuleId: string;
  onToggle: () => void;
  onSelectModule: (moduleId: string) => void;
}) {
  return (
    <section className="border-b border-slate-200 pb-9 pt-2 first:pt-0 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center gap-5 text-left"
        aria-expanded={open}
      >
        <span className="shrink-0 rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
          Unit {unitIndex + 1}
        </span>
        <span className="min-w-0 flex-1 text-balance font-serif text-2xl font-black leading-tight tracking-tight text-[#071a33] sm:text-3xl">
          {unit.title}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-slate-500 transition-transform duration-200 group-hover:text-[#0b1f3a]",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="relative ml-6 mt-7">
            <div className="absolute left-0 top-0 h-full w-px bg-slate-200" />
            <div className="space-y-7">
              {unit.modules.map((module, moduleIndex) => (
                <PathwayModuleNode
                  key={module.id}
                  module={module}
                  moduleIndex={moduleIndex}
                  selected={module.id === selectedModuleId}
                  onSelect={() => onSelectModule(module.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathwayModuleNode({
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
    <button
      type="button"
      onClick={onSelect}
      className="group relative grid w-full min-h-11 grid-cols-[64px_minmax(0,1fr)] items-center text-left"
    >
      <span
        className={cn(
          "relative z-10 -ml-[11px] grid size-6 place-items-center rounded-full border bg-white transition-colors",
          selected ? "border-blue-200" : "border-slate-300",
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-[#0b1f3a]" />}
      </span>
      <span
        className={cn(
          "min-w-0 text-pretty break-words pr-6 text-lg leading-7 text-[#071a33] transition-colors group-hover:text-[#0b1f3a] xl:pr-16",
          selected && "font-semibold text-[#0b1f3a]",
        )}
      >
        {module.title}
      </span>
      <span className="sr-only">Module {moduleIndex + 1}</span>
    </button>
  );
}

function SelectedModuleCard({
  module,
  moduleIndex,
}: {
  module: CoursePathwayModule;
  moduleIndex: number;
}) {
  return (
    <article className="mt-10 rounded-[1.25rem] border border-slate-200 bg-white px-7 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)] xl:absolute xl:bottom-0 xl:right-0 xl:mt-0 xl:w-[330px]">
      <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#2554e8]">
        Module {moduleIndex}
      </p>
      <h3 className="mt-5 text-pretty font-serif text-2xl font-black leading-tight tracking-tight text-[#071a33]">
        {module.title}
      </h3>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        {module.description}
      </p>
      <Button
        asChild
        size="lg"
        className="mt-7 h-13 rounded-full bg-[#0b1f3a] px-7 text-base font-bold text-white hover:bg-[#12345c]"
      >
        <Link href={module.href}>
          Start
          <ArrowRight className="size-5" />
        </Link>
      </Button>
    </article>
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
      <span className="grid size-13 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-[#0b1f3a]">
        <Icon className="size-6" />
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
        className="h-auto w-full max-w-[285px]"
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
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.75"
        />
        <rect x="58" y="174" width="34" height="52" rx="3" fill="#94a3b8" />
        <rect x="105" y="151" width="41" height="75" rx="3" fill="#64748b" />
        <rect x="162" y="116" width="47" height="110" rx="3" fill="#475569" />
        <path
          d="M48 226h178"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M72 80l34-28 41 19 48-43"
          fill="none"
          stroke="#0b1f3a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <LineChart className="hidden" />
      </svg>
    </div>
  );
}
