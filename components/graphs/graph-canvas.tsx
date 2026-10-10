import type { CurveStyle, RegionFill, Scene, XY } from "@/lib/graphs/engine";
import { cn } from "@/lib/ui";

const WIDTH = 640;
const HEIGHT = 440;
const PAD = { top: 30, right: 86, bottom: 58, left: 66 };
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
  const sx = (x: number) => PAD.left + (x / scene.xMax) * PLOT_W;
  const sy = (y: number) => PAD.top + PLOT_H - (y / scene.yMax) * PLOT_H;
  const clipId = `${graphId}-clip`;

  const usedLabelSpots: XY[] = [];
  const placeLabel = (x: number, y: number): XY => {
    let spot = { x, y };
    let guard = 0;
    while (
      usedLabelSpots.some(
        (used) =>
          Math.abs(used.x - spot.x) < 34 && Math.abs(used.y - spot.y) < 15,
      ) &&
      guard < 6
    ) {
      spot = { x: spot.x, y: spot.y + 16 };
      guard++;
    }
    usedLabelSpots.push(spot);
    return spot;
  };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={scene.caption ?? `${scene.yLabel} against ${scene.xLabel}`}
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

            return (
              <g key={region.id}>
                <path d={d} fill={color.fill} />
                {region.label && showLabels && (
                  <text
                    x={sx(cx)}
                    y={sy(cy) + 4}
                    textAnchor="middle"
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
            {guide.yLabel && (
              <text
                x={PAD.left - 8}
                y={sy(guide.y) + 4}
                textAnchor="end"
                fontSize="12.5"
                fontWeight="700"
                fill="#0b1f3a"
              >
                {guide.yLabel}
              </text>
            )}
            {guide.xLabel && (
              <text
                x={sx(guide.x)}
                y={PAD.top + PLOT_H + 17}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="700"
                fill="#0b1f3a"
              >
                {guide.xLabel}
              </text>
            )}
          </g>
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
        const spot = placeLabel(rawX, rawY);

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
        scene.points?.map((point) => (
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
              x={sx(point.x) + 9}
              y={sy(point.y) - 8}
              fontSize="13"
              fontWeight="750"
              fill="#0b1f3a"
            >
              {point.label}
            </text>
          </g>
        ))}

      {/* annotations */}
      {showLabels &&
        scene.annotations?.map((annotation) => (
          <text
            key={annotation.id}
            x={sx(annotation.x)}
            y={sy(annotation.y)}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#5d6978"
          >
            {annotation.text}
          </text>
        ))}

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
