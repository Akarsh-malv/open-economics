"use client";

import { RotateCcw } from "lucide-react";
import type {
  ControlConfig,
  ControlValues,
  ScenarioPreset,
} from "@/lib/graphs/engine";
import { cn } from "@/lib/ui";

function formatSliderValue(value: number, unit?: string): string {
  if (unit === " ÷10") return String(Math.round(value) / 10);
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}${unit ?? ""}`;
}

export function GraphControls({
  graphId,
  controls,
  presets,
  values,
  onChange,
  onApplyPreset,
  onReset,
}: {
  graphId: string;
  controls: ControlConfig[];
  presets?: ScenarioPreset[];
  values: ControlValues;
  onChange: (id: string, value: number | string | boolean) => void;
  onApplyPreset: (preset: ScenarioPreset) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-oe-text-muted">
          Controls
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-oe-border bg-oe-surface px-3 py-1.5 text-xs font-bold text-oe-text transition-colors hover:bg-oe-surface-elevated"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </div>

      {presets && presets.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-oe-text-muted">Scenarios</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="rounded-full border border-oe-border bg-oe-surface px-3 py-1.5 text-xs font-semibold text-oe-text transition-colors hover:border-[#2554e8]/40 hover:bg-blue-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {controls.map((control) => (
          <ControlField
            key={`${graphId}-${control.id}`}
            control={control}
            value={values[control.id]}
            onChange={(value) => onChange(control.id, value)}
          />
        ))}
      </div>
    </div>
  );
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: ControlConfig;
  value: number | string | boolean | undefined;
  onChange: (value: number | string | boolean) => void;
}) {
  if (control.kind === "slider") {
    const current = typeof value === "number" ? value : control.defaultValue;
    return (
      <label className="block">
        <span className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-oe-text">
            {control.label}
          </span>
          <span className="text-sm font-bold tabular-nums text-[#1d43ae]">
            {formatSliderValue(current, control.unit)}
          </span>
        </span>
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={current}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-oe-surface-elevated accent-[#0b1f3a]"
          aria-label={control.label}
        />
      </label>
    );
  }

  if (control.kind === "segmented") {
    const current = typeof value === "string" ? value : control.defaultValue;
    return (
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-oe-text">
          {control.label}
        </legend>
        <div
          className="flex flex-wrap gap-1.5"
          role="radiogroup"
          aria-label={control.label}
        >
          {control.options.map((option) => {
            const active = option.value === current;
            return (
              // biome-ignore lint/a11y/useSemanticElements: styled segmented control; buttons provide native keyboard and focus behavior
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(option.value)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-[#0b1f3a] bg-[#0b1f3a] text-white"
                    : "border-oe-border bg-oe-surface text-oe-text-muted hover:bg-oe-surface-elevated hover:text-oe-text",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  const current = typeof value === "boolean" ? value : control.defaultValue;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={current}
      onClick={() => onChange(!current)}
      className="flex w-full items-center justify-between gap-3 text-left"
    >
      <span className="text-sm font-semibold text-oe-text">
        {control.label}
      </span>
      <span
        className={cn(
          "relative h-5.5 w-10 shrink-0 rounded-full transition-colors",
          current
            ? "bg-[#0b1f3a]"
            : "bg-oe-surface-elevated ring-1 ring-oe-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4.5 rounded-full bg-white shadow transition-transform",
            current ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
