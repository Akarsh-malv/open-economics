"use client";

import { useState } from "react";
import { cn } from "@/lib/ui";

export type EconomicsGraphPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind?: "efficient" | "inefficient" | "unattainable" | "equilibrium" | "default";
};

export type EconomicsGraphCurve = {
  id: string;
  label?: string;
  points: { x: number; y: number }[];
  tone?: "accent" | "secondary" | "muted";
};

export type EconomicsGraphAnnotation = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type EconomicsGraphConfig = {
  type: "ppc" | "supply-demand" | "marginal";
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xMax: number;
  yMax: number;
  curves: EconomicsGraphCurve[];
  points?: EconomicsGraphPoint[];
  annotations?: EconomicsGraphAnnotation[];
};

const WIDTH = 720;
const HEIGHT = 500;
const PAD = { top: 42, right: 52, bottom: 82, left: 82 };
const PLOT_WIDTH = WIDTH - PAD.left - PAD.right;
const PLOT_HEIGHT = HEIGHT - PAD.top - PAD.bottom;

export function InteractiveEconomicsGraph({
  config,
  activePointId,
  onPointSelect,
  className,
}: {
  config: EconomicsGraphConfig;
  activePointId?: string | null;
  onPointSelect?: (point: EconomicsGraphPoint) => void;
  className?: string;
}) {
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const sx = (x: number) => PAD.left + (x / config.xMax) * PLOT_WIDTH;
  const sy = (y: number) => PAD.top + PLOT_HEIGHT - (y / config.yMax) * PLOT_HEIGHT;
  const hasClickablePoints = Boolean(onPointSelect);

  return (
    <figure
      className={cn(
        "rounded-[1.4rem] border border-oe-border bg-oe-surface-elevated/70 p-4 shadow-lg shadow-black/10 sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <figcaption className="text-sm font-semibold tracking-tight text-oe-text">
          {config.title}
        </figcaption>
        {hasClickablePoints && (
          <p className="text-xs text-oe-text-muted">Select a point to inspect it</p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-oe-border bg-oe-background/55">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby={`${config.type}-title`}
        >
          <title id={`${config.type}-title`}>{config.title}</title>
          <defs>
            <pattern
              id={`${config.type}-grid`}
              width={PLOT_WIDTH / 4}
              height={PLOT_HEIGHT / 4}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${PLOT_WIDTH / 4} 0 L 0 0 0 ${PLOT_HEIGHT / 4}`}
                fill="none"
                stroke="var(--oe-border)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width={WIDTH} height={HEIGHT} fill="transparent" />
          <rect
            x={PAD.left}
            y={PAD.top}
            width={PLOT_WIDTH}
            height={PLOT_HEIGHT}
            fill={`url(#${config.type}-grid)`}
            opacity="0.72"
          />

          <g stroke="var(--oe-text-muted)" strokeLinecap="round">
            <line
              x1={PAD.left}
              x2={PAD.left}
              y1={PAD.top - 6}
              y2={PAD.top + PLOT_HEIGHT}
              strokeWidth="1.7"
            />
            <line
              x1={PAD.left}
              x2={PAD.left + PLOT_WIDTH + 6}
              y1={PAD.top + PLOT_HEIGHT}
              y2={PAD.top + PLOT_HEIGHT}
              strokeWidth="1.7"
            />
          </g>

          {[0, 0.5, 1].map((tick) => (
            <g key={tick} fill="var(--oe-text-muted)" fontSize="12">
              <text
                x={PAD.left + PLOT_WIDTH * tick}
                y={PAD.top + PLOT_HEIGHT + 24}
                textAnchor="middle"
              >
                {Math.round(config.xMax * tick)}
              </text>
              <text
                x={PAD.left - 18}
                y={PAD.top + PLOT_HEIGHT - PLOT_HEIGHT * tick + 4}
                textAnchor="end"
              >
                {Math.round(config.yMax * tick)}
              </text>
            </g>
          ))}

          <text
            x={PAD.left + PLOT_WIDTH / 2}
            y={HEIGHT - 24}
            textAnchor="middle"
            fill="var(--oe-text-muted)"
            fontSize="15"
            fontWeight="600"
          >
            {config.xAxisLabel}
          </text>
          <text
            x="25"
            y={PAD.top + PLOT_HEIGHT / 2}
            textAnchor="middle"
            fill="var(--oe-text-muted)"
            fontSize="15"
            fontWeight="600"
            transform={`rotate(-90 25 ${PAD.top + PLOT_HEIGHT / 2})`}
          >
            {config.yAxisLabel}
          </text>

          {config.curves.map((curve) => {
            const d = curve.points
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"} ${sx(point.x)} ${sy(point.y)}`,
              )
              .join(" ");
            const stroke = getCurveColor(curve.tone);
            const labelPoint =
              curve.points[Math.floor(curve.points.length * 0.62)] ??
              curve.points[0];

            return (
              <g key={curve.id}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(0,0,0,0.28)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.18"
                />
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {curve.label && labelPoint && (
                  <text
                    x={sx(labelPoint.x) + 10}
                    y={sy(labelPoint.y) - 10}
                    fill={stroke}
                    fontSize="14"
                    fontWeight="700"
                  >
                    {curve.label}
                  </text>
                )}
              </g>
            );
          })}

          {config.annotations?.map((annotation) => (
            <g key={annotation.id}>
              <line
                x1={sx(annotation.x)}
                x2={sx(annotation.x)}
                y1={sy(annotation.y) + 8}
                y2={sy(annotation.y) + 20}
                stroke="var(--oe-border)"
                strokeWidth="1.2"
              />
              <WrappedText
                lines={wrapLabel(annotation.label, 18)}
                x={sx(annotation.x)}
                y={sy(annotation.y)}
                className="fill-[var(--oe-text-muted)]"
              />
            </g>
          ))}

          {config.points?.map((point) => {
            const selected = activePointId === point.id;
            const hovered = hoveredPointId === point.id;
            const fill = getPointColor(point.kind);
            const pointX = sx(point.x);
            const pointY = sy(point.y);

            return (
              <g key={point.id}>
                <g
                  role={onPointSelect ? "button" : undefined}
                  tabIndex={onPointSelect ? 0 : undefined}
                  aria-label={`Select point ${point.label}`}
                  onMouseEnter={() => setHoveredPointId(point.id)}
                  onMouseLeave={() => setHoveredPointId(null)}
                  onClick={() => onPointSelect?.(point)}
                  onKeyDown={(event) => {
                    if (!onPointSelect) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onPointSelect(point);
                    }
                  }}
                  className={onPointSelect ? "cursor-pointer" : "cursor-default"}
                >
                  <circle
                    cx={pointX}
                    cy={pointY}
                    r={18}
                    fill={fill}
                    opacity={hovered || selected ? "0.16" : "0"}
                  />
                  <circle
                    cx={pointX}
                    cy={pointY}
                    r={selected ? 10 : hovered ? 9 : 7.5}
                    fill={fill}
                    stroke={selected ? "var(--oe-text)" : "var(--oe-background)"}
                    strokeWidth={selected ? "2.4" : "2"}
                    className="transition-all"
                  />
                </g>
                <text
                  x={pointX + 13}
                  y={pointY - 11}
                  fill="var(--oe-text)"
                  fontSize="14"
                  fontWeight="750"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {config.points && config.points.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {config.points.map((point) => (
            <span
              key={point.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-oe-border bg-oe-background/45 px-3 py-1 text-xs font-medium text-oe-text-muted",
                activePointId === point.id && "border-oe-accent/45 text-oe-text",
              )}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: getPointColor(point.kind) }}
              />
              {point.label}: {formatPointKind(point.kind)}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}

function WrappedText({
  lines,
  x,
  y,
  className,
}: {
  lines: string[];
  x: number;
  y: number;
  className?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="13"
      fontWeight="600"
      className={className}
    >
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : 15}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function wrapLabel(label: string, maxLength: number) {
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function getCurveColor(tone: EconomicsGraphCurve["tone"]) {
  switch (tone) {
    case "secondary":
      return "var(--oe-accent-secondary)";
    case "muted":
      return "var(--oe-text-muted)";
    default:
      return "var(--oe-accent)";
  }
}

function getPointColor(kind: EconomicsGraphPoint["kind"]) {
  switch (kind) {
    case "efficient":
      return "var(--oe-accent)";
    case "inefficient":
      return "var(--oe-accent-secondary)";
    case "unattainable":
      return "var(--oe-error)";
    case "equilibrium":
      return "var(--oe-success)";
    default:
      return "var(--oe-text-muted)";
  }
}

function formatPointKind(kind: EconomicsGraphPoint["kind"]) {
  switch (kind) {
    case "efficient":
      return "efficient";
    case "inefficient":
      return "inefficient";
    case "unattainable":
      return "unattainable";
    case "equilibrium":
      return "equilibrium";
    default:
      return "point";
  }
}
