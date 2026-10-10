"use client";

import { ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomDiagram } from "@/components/graphs/custom-diagrams";
import { GraphCanvas } from "@/components/graphs/graph-canvas";
import { GraphControls } from "@/components/graphs/graph-controls";
import { getGraphDefinition, graphLibrary } from "@/lib/graphs";
import {
  type ControlValues,
  defaultControlValues,
  type ScenarioPreset,
} from "@/lib/graphs/engine";
import { cn } from "@/lib/ui";

export function GraphLab({ initialGraphId }: { initialGraphId: string }) {
  const [selectedId, setSelectedId] = useState(initialGraphId);
  const [search, setSearch] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [showEquilibrium, setShowEquilibrium] = useState(true);
  const [showRegions, setShowRegions] = useState(true);

  const definition =
    getGraphDefinition(selectedId) ?? getGraphDefinition(initialGraphId);

  // Control values are plain state so every change re-renders and recomputes;
  // the ref only preserves each graph's values across graph switches.
  const savedValues = useRef(new Map<string, ControlValues>());
  const [values, setValues] = useState<ControlValues>(() =>
    definition ? defaultControlValues(definition) : {},
  );

  const switchTo = useCallback(
    (id: string, current: { id: string; values: ControlValues } | null) => {
      const next = getGraphDefinition(id);
      if (!next) return;
      if (current) savedValues.current.set(current.id, current.values);
      setSelectedId(id);
      setValues(savedValues.current.get(id) ?? defaultControlValues(next));
    },
    [],
  );

  const selectGraph = useCallback(
    (id: string) => {
      if (!definition || id === definition.id) return;
      switchTo(id, { id: definition.id, values });
      window.history.pushState(null, "", `/graphs/${id}`);
    },
    [definition, values, switchTo],
  );

  // Keep the selected graph in sync with browser back/forward navigation.
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/graphs\/([^/]+)\/?$/);
      const id = match ? decodeURIComponent(match[1]) : initialGraphId;
      if (getGraphDefinition(id)) {
        switchTo(id, null);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [initialGraphId, switchTo]);

  const handleControlChange = useCallback(
    (id: string, value: number | string | boolean) => {
      setValues((current) => ({ ...current, [id]: value }));
    },
    [],
  );

  const handlePreset = useCallback((preset: ScenarioPreset) => {
    setValues((current) => ({ ...current, ...preset.values }));
  }, []);

  const handleReset = useCallback(() => {
    if (!definition) return;
    setValues(defaultControlValues(definition));
  }, [definition]);

  const filteredLibrary = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return graphLibrary;
    return graphLibrary.map((group) => ({
      ...group,
      categories: group.categories
        .map((category) => ({
          ...category,
          graphs: category.graphs.filter(
            (graph) =>
              graph.title.toLowerCase().includes(query) ||
              category.name.toLowerCase().includes(query),
          ),
        }))
        .filter((category) => category.graphs.length > 0),
    }));
  }, [search]);

  if (!definition) return null;
  const computed = definition.compute?.(values) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
      {/* Mobile graph picker */}
      <div className="lg:hidden">
        <label className="relative block">
          <span className="mb-1.5 block text-sm font-bold text-oe-text">
            Choose a graph
          </span>
          <select
            value={definition.id}
            onChange={(event) => selectGraph(event.target.value)}
            className="w-full appearance-none rounded-xl border border-oe-border bg-oe-surface px-4 py-3 pr-10 text-sm font-semibold text-oe-text"
          >
            {graphLibrary.map((group) =>
              group.categories.map((category) => (
                <optgroup
                  key={`${group.course}-${category.name}`}
                  label={`${group.courseLabel} — ${category.name}`}
                >
                  {category.graphs.map((graph) => (
                    <option key={graph.id} value={graph.id}>
                      {graph.title}
                    </option>
                  ))}
                </optgroup>
              )),
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3.5 size-4 text-oe-text-muted" />
        </label>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col rounded-[1.5rem] border border-oe-border bg-oe-surface">
          <div className="border-b border-oe-border p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-oe-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search graphs…"
                aria-label="Search graphs"
                className="w-full rounded-lg border border-oe-border bg-oe-background/60 py-2 pl-9 pr-3 text-sm text-oe-text placeholder:text-oe-text-muted focus:border-[#2554e8]/50 focus:outline-none"
              />
            </label>
          </div>

          <nav
            className="flex-1 overflow-y-auto p-3"
            aria-label="Graph library"
          >
            {filteredLibrary.map((group) => (
              <div key={group.course} className="mb-4">
                <p className="px-2 pb-1 pt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1d43ae]">
                  {group.courseLabel}
                </p>
                {group.categories.map((category) => (
                  <div key={category.name} className="mb-1.5">
                    <p className="px-2 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.08em] text-oe-text-muted">
                      {category.name}
                    </p>
                    <ul>
                      {category.graphs.map((graph) => {
                        const active = graph.id === definition.id;
                        return (
                          <li key={graph.id}>
                            <button
                              type="button"
                              onClick={() => selectGraph(graph.id)}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors",
                                active
                                  ? "bg-[#0b1f3a] font-semibold text-white"
                                  : "text-oe-text-muted hover:bg-oe-surface-elevated hover:text-oe-text",
                              )}
                            >
                              {graph.title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
            {filteredLibrary.every(
              (group) => group.categories.length === 0,
            ) && (
              <p className="px-2 py-4 text-sm text-oe-text-muted">
                No graphs match “{search}”.
              </p>
            )}
          </nav>
        </div>
      </aside>

      {/* Workspace */}
      <section className="min-w-0">
        <div className="rounded-[1.75rem] border border-oe-border bg-oe-surface p-5 sm:p-7">
          <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1d43ae]">
                {definition.course === "ap-micro"
                  ? "AP Microeconomics"
                  : "AP Macroeconomics"}{" "}
                · {definition.category}
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-oe-text">
                {definition.title}
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-oe-text-muted">
                {definition.description}
              </p>
            </div>

            {!definition.hideStandardToggles && computed && (
              <div className="flex flex-wrap gap-1.5">
                <ViewToggle
                  label="Labels"
                  active={showLabels}
                  onClick={() => setShowLabels((v) => !v)}
                />
                <ViewToggle
                  label="Equilibrium"
                  active={showEquilibrium}
                  onClick={() => setShowEquilibrium((v) => !v)}
                />
                <ViewToggle
                  label="Areas"
                  active={showRegions}
                  onClick={() => setShowRegions((v) => !v)}
                />
              </div>
            )}
          </header>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
            <div className="min-w-0">
              {computed ? (
                <div
                  className={cn(
                    "grid gap-4",
                    computed.scenes.length > 1 && "md:grid-cols-2",
                  )}
                >
                  {computed.scenes.map((scene, index) => (
                    <div
                      key={scene.caption ?? `scene-${index}`}
                      className="rounded-2xl border border-oe-border bg-oe-background/50 p-2"
                    >
                      <GraphCanvas
                        scene={scene}
                        graphId={`${definition.id}-${index}`}
                        showLabels={showLabels}
                        showEquilibrium={showEquilibrium}
                        showRegions={showRegions}
                      />
                    </div>
                  ))}
                </div>
              ) : definition.custom ? (
                <div className="rounded-2xl border border-oe-border bg-oe-background/50 p-4 sm:p-5">
                  <CustomDiagram kind={definition.custom} values={values} />
                </div>
              ) : null}

              {computed && (
                <div className="mt-4">
                  {computed.readouts && computed.readouts.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {computed.readouts.map((readout) => (
                        <span
                          key={readout.label}
                          className="inline-flex items-baseline gap-1.5 rounded-full border border-oe-border bg-oe-surface-elevated/60 px-3 py-1.5 text-xs font-semibold text-oe-text-muted"
                        >
                          {readout.label}:
                          <span className="text-sm font-bold text-oe-text">
                            {readout.value}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="rounded-2xl border border-oe-border bg-oe-surface-elevated/50 px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-oe-text-muted">
                      What changed?
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-oe-text">
                      {computed.explanation}
                    </p>
                  </div>
                </div>
              )}

              {definition.details && (
                <div className="mt-4 space-y-2">
                  {definition.details.interpretation && (
                    <DetailSection
                      title="Key interpretation"
                      body={definition.details.interpretation}
                    />
                  )}
                  {definition.details.mistake && (
                    <DetailSection
                      title="Common mistake"
                      body={definition.details.mistake}
                    />
                  )}
                  {definition.details.examTip && (
                    <DetailSection
                      title="AP exam tip"
                      body={definition.details.examTip}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-oe-border bg-oe-background/40 p-5 xl:self-start">
              <GraphControls
                graphId={definition.id}
                controls={definition.controls}
                presets={definition.presets}
                values={values}
                onChange={handleControlChange}
                onApplyPreset={handlePreset}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ViewToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
        active
          ? "border-[#0b1f3a]/20 bg-[#0b1f3a]/8 text-[#0b1f3a]"
          : "border-oe-border bg-oe-surface text-oe-text-muted line-through decoration-1 hover:text-oe-text",
      )}
    >
      {label}
    </button>
  );
}

function DetailSection({ title, body }: { title: string; body: string }) {
  return (
    <details className="group rounded-xl border border-oe-border bg-oe-surface">
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold text-oe-text [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 text-oe-text-muted transition-transform group-open:rotate-180" />
      </summary>
      <p className="border-t border-oe-border px-4 py-3 text-sm leading-6 text-oe-text-muted">
        {body}
      </p>
    </details>
  );
}
