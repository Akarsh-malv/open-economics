import type { CurveStyle, RegionFill, Scene, XY } from "@/lib/graphs/engine";
import { cn } from "@/lib/ui";

const WIDTH = 640;
const HEIGHT = 464;
const PAD = { top: 30, right: 86, bottom: 82, left: 100 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

const CURVE_COLOR: Record<CurveStyle, string> = {
  primary: "#0b1f3a",
  secondary: "#2554e8",
  tertiary: "#b45309",
  muted: "#5d6978",
  reference: "#94a3b8",
};

const REGION_COLOR: Record<RegionFill, { fill: string; label: string }> = {
  cs: { fill: "rgba(37, 84, 232, 0.16)", label: "#1d43ae" },
  ps: { fill: "rgba(11, 31, 58, 0.15)", label: "#0b1f3a" },
  dwl: { fill: "rgba(180, 83, 9, 0.24)", label: "#8a4207" },
  revenue: { fill: "rgba(93, 105, 120, 0.22)", label: "#42505f" },
  cost: { fill: "rgba(179, 66, 62, 0.16)", label: "#993733" },
  benefit: { fill: "rgba(15, 118, 110, 0.16)", label: "#0d5f59" },
};

export function GraphCanvas({
  scene,
  graphId,
  showLabels = true,
  showEquilibrium = true,
  showRegions = true,
  className,
}: {
  scene: Scene;
  graphId: string;
  showLabels?: boolean;
  showEquilibrium?: boolean;
  showRegions?: boolean;
  className?: string;
}) {
  if (scene.diagram) {
    const { nodes, edges } = scene.diagram;
    return <svg viewBox="0 0 640 464" role="img" aria-label={scene.caption ?? "Circular flow diagram"} className={cn("h-auto w-full", className)}>
      <defs>{["real", "money"].map(kind => <marker key={kind} id={`${graphId}-${kind}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={kind === "real" ? "#0b1f3a" : "#2554e8"} /></marker>)}</defs>
      {edges.map(edge => {
        const from = nodes.find(node => node.id === edge.from)!;
        const to = nodes.find(node => node.id === edge.to)!;
        const horizontal = from.y === to.y;
        const dx = Math.sign(to.x - from.x), dy = Math.sign(to.y - from.y);
        const x1 = from.x + (horizontal ? dx * 72 : 0), x2 = to.x - (horizontal ? dx * 72 : 0);
        const y1 = from.y + (horizontal ? edge.lane : dy * 26), y2 = to.y + (horizontal ? edge.lane : -dy * 26);
        return <g key={edge.id}><path d={`M${x1} ${y1} L${x2} ${y2}`} fill="none" stroke={edge.kind === "real" ? "#0b1f3a" : "#2554e8"} strokeWidth="2.5" strokeDasharray={edge.kind === "money" ? "7 4" : undefined} markerEnd={`url(#${graphId}-${edge.kind})`} /><text x={(x1+x2)/2 + (horizontal ? 0 : edge.lane)} y={(y1+y2)/2 - 7} textAnchor="middle" fill="#0b1f3a" fontSize="14">{edge.label}</text></g>;
      })}
      {nodes.map(node => <g key={node.id}><rect x={node.x-72} y={node.y-26} width="144" height="52" rx="8" fill="#eef3f7" stroke="#0b1f3a" /><text x={node.x} y={node.y+5} fontSize="15" textAnchor="middle" fill="#0b1f3a">{node.label}</text></g>)}
      <text x="320" y="420" textAnchor="middle" fontSize="14" fill="#0b1f3a">Solid: real flows · Dashed: money flows</text>
    </svg>;
  }
  const sx = (x: number) => PAD.left + (x / scene.xMax) * PLOT_W;
  const yMin = scene.yMin ?? 0;
  const sy = (y: number) => PAD.top + PLOT_H - ((y - yMin) / (scene.yMax - yMin)) * PLOT_H;
  const clipId = `${graphId}-clip`;

  const usedLabelSpots: (XY & { width: number })[] = [];
  const placeLabel = (x: number, y: number, text: string): XY => {
    const width = Math.max(12, text.length * 7.5);
    let spot = { x: Math.max(PAD.left + 4, Math.min(x, WIDTH - width - 8)), y: Math.max(PAD.top + 12, Math.min(y, PAD.top + PLOT_H - 4)), width };
    let guard = 0;
    while (
      usedLabelSpots.some(
        (used) =>
          used.x < spot.x + width + 4 && spot.x < used.x + used.width + 4 && Math.abs(used.y - spot.y) < 17,
      ) &&
      guard < 12
    ) {
      spot = { ...spot, y: spot.y + 18 };
      if (spot.y > PAD.top + PLOT_H - 4) spot = { ...spot, y: Math.max(PAD.top + 12, y - 18 * (guard + 1)) };
      guard++;
    }
    usedLabelSpots.push(spot);
    return spot;
  };

  const axisLabels = (axis: "x" | "y") => {
    const grouped = new Map<number, Set<string>>();
    for (const guide of scene.guides ?? []) {
      const label = axis === "x" ? guide.xLabel : guide.yLabel;
      if (!label) continue;
      const coordinate = Math.round(guide[axis] * 1e8) / 1e8;
      if (!grouped.has(coordinate)) grouped.set(coordinate, new Set());
      grouped.get(coordinate)?.add(label);
    }
    const labels = [...grouped].map(([coordinate, words]) => ({ coordinate, text: [...words].join(" = ") }));
    if (axis === "y") {
      let previous = -Infinity;
      return labels.sort((a, b) => b.coordinate - a.coordinate).map((label) => {
        const original = sy(label.coordinate) + 4;
        const position = Math.max(original, previous + 17);
        previous = position;
        return { ...label, original, position, row: 0 };
      });
    }
    const ends = [-Infinity, -Infinity];
    return labels.sort((a, b) => a.coordinate - b.coordinate).map((label) => {
      const width = label.text.length * 7;
      const position = Math.max(PAD.left + width / 2, Math.min(sx(label.coordinate), WIDTH - width / 2 - 8));
      const row = position - width / 2 > ends[0] + 5 ? 0 : 1;
      ends[row] = position + width / 2;
      return { ...label, original: sx(label.coordinate), position, row };
    });
  };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`${scene.yLabel} against ${scene.xLabel}${scene.caption ? ` · ${scene.caption}` : ""}`}
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} />
        </clipPath>
      </defs>

      {/* recessive grid */}
      <g stroke="rgba(11,31,58,0.07)" strokeWidth="1">
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line
              x1={PAD.left + PLOT_W * t}
              x2={PAD.left + PLOT_W * t}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
            />
            <line
              x1={PAD.left}
              x2={PAD.left + PLOT_W}
              y1={PAD.top + PLOT_H * t}
              y2={PAD.top + PLOT_H * t}
            />
          </g>
        ))}
      </g>

      {/* shaded regions */}
      {showRegions && (
        <g clipPath={`url(#${clipId})`}>
          {scene.regions?.map((region) => {
            if (region.points.length < 3) return null;
            const color = REGION_COLOR[region.fill];
            const d = `${region.points
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"} ${sx(point.x)} ${sy(point.y)}`,
              )
              .join(" ")} Z`;
            const cx =
              region.points.reduce((sum, p) => sum + p.x, 0) /
              region.points.length;
            const cy =
              region.points.reduce((sum, p) => sum + p.y, 0) /
              region.points.length;
            const labelSpot = region.label ? placeLabel(sx(cx) - region.label.length * 3.75, sy(cy) + 4, region.label) : null;

            return (
              <g key={region.id}>
                <path d={d} fill={color.fill} />
                {region.label && showLabels && (
                  <text
                    x={labelSpot?.x}
                    y={labelSpot?.y}
                    textAnchor="start"
                    fontSize="12"
                    fontWeight="700"
                    fill={color.label}
                  >
                    {region.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* guides */}
      {showEquilibrium &&
        scene.guides?.map((guide) => (
          <g key={guide.id}>
            <path
              d={`M ${PAD.left} ${sy(guide.y)} L ${sx(guide.x)} ${sy(guide.y)} L ${sx(guide.x)} ${PAD.top + PLOT_H}`}
              fill="none"
              stroke="#5d6978"
              strokeWidth="1.3"
              strokeDasharray="4 4"
            />
          </g>
        ))}
      {showEquilibrium && axisLabels("y").map((label) => (
        <g key={`y-${label.coordinate}`}>
          {label.position !== label.original && <line x1={PAD.left - 3} y1={label.original - 4} x2={PAD.left - 8} y2={label.position - 4} stroke="#5d6978" />}
          <text x={PAD.left - 10} y={label.position} textAnchor="end" fontSize="12.5" fontWeight="600" fill="#0b1f3a">{label.text}</text>
        </g>
      ))}
      {showEquilibrium && axisLabels("x").map((label) => (
        <text key={`x-${label.coordinate}`} x={label.position} y={PAD.top + PLOT_H + 17 + label.row * 18} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#0b1f3a">{label.text}</text>
      ))}

      {/* curves */}
      {scene.curves.map((curve) => {
        if (curve.points.length < 2) return null;
        const color = CURVE_COLOR[curve.style];
        const d = curve.points
          .map(
            (point, index) =>
              `${index === 0 ? "M" : "L"} ${sx(point.x)} ${sy(point.y)}`,
          )
          .join(" ");
        const anchorPoint = curve.labelAtStart
          ? curve.points[0]
          : curve.points[curve.points.length - 1];
        const rawX = sx(anchorPoint.x) + (curve.labelAtStart ? -8 : 7);
        const rawY = sy(anchorPoint.y) - 6;
        const spot = placeLabel(rawX, rawY, curve.label);

        return (
          <g key={curve.id}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={curve.style === "reference" ? 2.2 : 3.2}
              strokeDasharray={curve.dashed ? "7 6" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath={`url(#${clipId})`}
            />
            {showLabels && (
              <text
                x={spot.x}
                y={spot.y}
                textAnchor={curve.labelAtStart ? "end" : "start"}
                fontSize="13.5"
                fontWeight="750"
                fill={color}
              >
                {curve.label}
              </text>
            )}
          </g>
        );
      })}

      {/* axes drawn above curves */}
      {yMin < 0 && scene.yMax > 0 && (
        <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" strokeWidth="1.2" />
      )}
      <g stroke="#42505f" strokeWidth="1.7" strokeLinecap="round">
        <line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top - 8}
          y2={PAD.top + PLOT_H}
        />
        <line
          x1={PAD.left}
          x2={PAD.left + PLOT_W + 8}
          y1={PAD.top + PLOT_H}
          y2={PAD.top + PLOT_H}
        />
        <path
          d={`M ${PAD.left - 4} ${PAD.top - 3} L ${PAD.left} ${PAD.top - 9} L ${PAD.left + 4} ${PAD.top - 3}`}
          fill="none"
        />
        <path
          d={`M ${PAD.left + PLOT_W + 3} ${PAD.top + PLOT_H - 4} L ${PAD.left + PLOT_W + 9} ${PAD.top + PLOT_H} L ${PAD.left + PLOT_W + 3} ${PAD.top + PLOT_H + 4}`}
          fill="none"
        />
      </g>

      {/* points */}
      {showEquilibrium &&
        scene.points?.map((point) => {
          const spot = placeLabel(sx(point.x) + 9, sy(point.y) - 8, point.label);
          return (
          <g key={point.id}>
            <circle
              cx={sx(point.x)}
              cy={sy(point.y)}
              r="5.5"
              fill={point.muted ? "#94a3b8" : "#0b1f3a"}
              stroke="#f5f7fa"
              strokeWidth="2"
            />
            <text
              x={spot.x}
              y={spot.y}
              fontSize="13"
              fontWeight="750"
              fill="#0b1f3a"
            >
              {point.label}
            </text>
          </g>
        );})}

      {/* annotations */}
      {showLabels &&
        scene.annotations?.map((annotation) => {
          const spot = placeLabel(sx(annotation.x), sy(annotation.y) - 10, annotation.text);
          return (
          <text
            key={annotation.id}
            x={spot.x}
            y={spot.y}
            textAnchor="start"
            fontSize="12"
            fontWeight="600"
            fill="#5d6978"
          >
            {annotation.text}
          </text>
        );})}

      {/* axis labels */}
      <text
        x={PAD.left + PLOT_W / 2}
        y={HEIGHT - 14}
        textAnchor="middle"
        fontSize="14"
        fontWeight="650"
        fill="#42505f"
      >
        {scene.xLabel}
      </text>
      <text
        x={20}
        y={PAD.top + PLOT_H / 2}
        textAnchor="middle"
        fontSize="14"
        fontWeight="650"
        fill="#42505f"
        transform={`rotate(-90 20 ${PAD.top + PLOT_H / 2})`}
      >
        {scene.yLabel}
      </text>

      {/* panel caption for linked layouts */}
      {scene.caption && (
        <text
          x={PAD.left}
          y={16}
          textAnchor="start"
          fontSize="13"
          fontWeight="700"
          fill="#0b1f3a"
        >
          {scene.caption}
        </text>
      )}
    </svg>
  );
}
