/** biome-ignore-all lint/suspicious/noArrayIndexKey: rounds and banks are identified by their position in the sequence */
"use client";

import {
  bool,
  type ControlValues,
  num,
  round1,
  str,
} from "@/lib/graphs/engine";
import { cn } from "@/lib/ui";

export function CustomDiagram({
  kind,
  values,
}: {
  kind: string;
  values: ControlValues;
}) {
  switch (kind) {
    case "payoff-matrix":
      return <PayoffMatrix values={values} />;
    case "circular-flow":
      return <CircularFlow values={values} />;
    case "multiplier":
      return <MultiplierRounds values={values} />;
    case "money-creation":
      return <MoneyCreation values={values} />;
    case "balance-of-payments":
      return <BalanceOfPayments values={values} />;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- */
/* Payoff matrix                                                      */
/* ---------------------------------------------------------------- */

type Payoffs = Record<"high" | "low", Record<"high" | "low", [number, number]>>;

const GAMES: Record<string, Payoffs> = {
  prisoners: {
    high: { high: [10, 10], low: [2, 14] },
    low: { high: [14, 2], low: [6, 6] },
  },
  "no-dominant": {
    high: { high: [12, 8], low: [4, 6] },
    low: { high: [5, 3], low: [9, 11] },
  },
};

function bestResponses(game: Payoffs) {
  const strategies = ["high", "low"] as const;
  const nash: string[] = [];
  for (const a of strategies) {
    for (const b of strategies) {
      const aBest = strategies.every((alt) => game[a][b][0] >= game[alt][b][0]);
      const bBest = strategies.every((alt) => game[a][b][1] >= game[a][alt][1]);
      if (aBest && bBest) nash.push(`${a}-${b}`);
    }
  }
  const dominant = (player: 0 | 1) => {
    const payoff = (own: "high" | "low", rival: "high" | "low") =>
      player === 0 ? game[own][rival][0] : game[rival][own][1];
    for (const candidate of strategies) {
      const other = candidate === "high" ? "low" : "high";
      const weaklyBetter = strategies.every(
        (rival) => payoff(candidate, rival) >= payoff(other, rival),
      );
      const strictlySomewhere = strategies.some(
        (rival) => payoff(candidate, rival) > payoff(other, rival),
      );
      if (weaklyBetter && strictlySomewhere) return candidate;
    }
    return null;
  };
  return { nash, aDominant: dominant(0), bDominant: dominant(1) };
}

function PayoffMatrix({ values }: { values: ControlValues }) {
  const scenario = str(values, "scenario", "prisoners");
  const game = GAMES[scenario] ?? GAMES.prisoners;
  const aChoice = str(values, "aStrategy", "high") as "high" | "low";
  const bChoice = str(values, "bStrategy", "high") as "high" | "low";
  const { nash, aDominant, bDominant } = bestResponses(game);
  const selectedIsNash = nash.includes(`${aChoice}-${bChoice}`);
  const strategyLabel = { high: "High price", low: "Low price" } as const;

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-2">
          <thead>
            <tr>
              <th aria-hidden className="w-28" />
              {(["high", "low"] as const).map((b) => (
                <th
                  key={b}
                  scope="col"
                  className="rounded-xl bg-oe-surface-elevated px-4 py-2 text-sm font-bold text-oe-text"
                >
                  Firm B: {strategyLabel[b]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["high", "low"] as const).map((a) => (
              <tr key={a}>
                <th
                  scope="row"
                  className="rounded-xl bg-oe-surface-elevated px-4 py-2 text-left text-sm font-bold text-oe-text"
                >
                  Firm A: {strategyLabel[a]}
                </th>
                {(["high", "low"] as const).map((b) => {
                  const [payoffA, payoffB] = game[a][b];
                  const isSelected = a === aChoice && b === bChoice;
                  const isNash = nash.includes(`${a}-${b}`);
                  return (
                    <td
                      key={b}
                      className={cn(
                        "min-w-[9.5rem] rounded-xl border px-4 py-4 text-center align-middle transition-colors",
                        isSelected
                          ? "border-[#0b1f3a] bg-[#0b1f3a] text-white ring-4 ring-blue-100"
                          : "border-oe-border bg-oe-surface",
                        !isSelected &&
                          isNash &&
                          "border-[#b45309] border-dashed",
                      )}
                    >
                      <span className="block text-base font-bold">
                        A: {payoffA} · B: {payoffB}
                      </span>
                      {isNash && (
                        <span
                          className={cn(
                            "mt-1 block text-xs font-semibold",
                            isSelected ? "text-blue-100" : "text-[#8a4207]",
                          )}
                        >
                          Nash equilibrium
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-oe-border bg-oe-surface-elevated/60 px-5 py-4 text-sm leading-6 text-oe-text-muted">
        <p>
          <strong className="text-oe-text">Dominant strategies:</strong>{" "}
          {aDominant
            ? `Firm A → ${strategyLabel[aDominant]}`
            : "Firm A has none"}
          ;{" "}
          {bDominant
            ? `Firm B → ${strategyLabel[bDominant]}`
            : "Firm B has none"}
          .
        </p>
        <p className="mt-1.5">
          Your selected cell ({strategyLabel[aChoice]} /{" "}
          {strategyLabel[bChoice]}) is{" "}
          {selectedIsNash ? (
            <strong className="text-oe-text">
              a Nash equilibrium — neither firm gains by deviating alone.
            </strong>
          ) : (
            <strong className="text-oe-text">
              not a Nash equilibrium — at least one firm profits by switching
              strategy.
            </strong>
          )}
          {scenario === "prisoners" &&
            " Both firms colluding at High/High beats the Nash outcome — but each is tempted to undercut, which is why cartels are unstable."}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Circular flow                                                      */
/* ---------------------------------------------------------------- */

function FlowBox({
  x,
  y,
  w,
  h,
  label,
  tone = "solid",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tone?: "solid" | "outline";
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={tone === "solid" ? "#0b1f3a" : "#ffffff"}
        stroke={tone === "solid" ? "none" : "#c3ccd9"}
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4.5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={tone === "solid" ? "#ffffff" : "#0b1f3a"}
      >
        {label}
      </text>
    </g>
  );
}

function FlowArrow({
  d,
  label,
  labelX,
  labelY,
  money,
}: {
  d: string;
  label: string;
  labelX: number;
  labelY: number;
  money: boolean;
}) {
  const color = money ? "#2554e8" : "#b45309";
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeDasharray={money ? undefined : "6 5"}
        markerEnd={money ? "url(#cf-arrow-money)" : "url(#cf-arrow-real)"}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="650"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

function CircularFlow({ values }: { values: ControlValues }) {
  const view = str(values, "view", "both");
  const showMoney = view !== "real";
  const showReal = view !== "money";
  const government = bool(values, "government");
  const financial = bool(values, "financial");
  const foreign = bool(values, "foreign");

  return (
    <div className="flex flex-col gap-4">
      <svg
        viewBox="0 0 640 460"
        role="img"
        aria-label="Circular flow of income and spending"
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="cf-arrow-money"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2554e8" />
          </marker>
          <marker
            id="cf-arrow-real"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#b45309" />
          </marker>
        </defs>

        <FlowBox
          x={250}
          y={16}
          w={140}
          h={46}
          label="Product market"
          tone="outline"
        />
        <FlowBox
          x={250}
          y={398}
          w={140}
          h={46}
          label="Factor market"
          tone="outline"
        />
        <FlowBox x={24} y={200} w={130} h={56} label="Households" />
        <FlowBox x={486} y={200} w={130} h={56} label="Firms" />

        {showMoney && (
          <>
            <FlowArrow
              d="M 100 200 C 110 96, 190 44, 246 40"
              label="consumer spending"
              labelX={138}
              labelY={92}
              money
            />
            <FlowArrow
              d="M 394 40 C 452 46, 528 98, 546 196"
              label="firm revenue"
              labelX={505}
              labelY={92}
              money
            />
            <FlowArrow
              d="M 546 260 C 530 366, 452 416, 394 420"
              label="wages, rent, interest"
              labelX={512}
              labelY={382}
              money
            />
            <FlowArrow
              d="M 246 420 C 188 414, 112 362, 96 262"
              label="household income"
              labelX={136}
              labelY={382}
              money
            />
          </>
        )}
        {showReal && (
          <>
            <FlowArrow
              d="M 258 66 C 208 82, 152 130, 134 196"
              label="goods & services"
              labelX={190}
              labelY={140}
              money={false}
            />
            <FlowArrow
              d="M 508 196 C 490 128, 434 82, 384 66"
              label="output"
              labelX={452}
              labelY={140}
              money={false}
            />
            <FlowArrow
              d="M 134 260 C 154 328, 208 376, 256 392"
              label="labor & resources"
              labelX={182}
              labelY={330}
              money={false}
            />
            <FlowArrow
              d="M 386 392 C 434 376, 488 328, 506 262"
              label="factors of production"
              labelX={462}
              labelY={330}
              money={false}
            />
          </>
        )}

        {government && (
          <>
            <FlowBox x={264} y={202} w={112} h={52} label="Government" />
            {showMoney && (
              <>
                <FlowArrow
                  d="M 160 220 L 258 220"
                  label="taxes"
                  labelX={208}
                  labelY={210}
                  money
                />
                <FlowArrow
                  d="M 258 240 L 160 240"
                  label="transfers"
                  labelX={208}
                  labelY={256}
                  money
                />
                <FlowArrow
                  d="M 382 220 L 480 220"
                  label="spending"
                  labelX={430}
                  labelY={210}
                  money
                />
                <FlowArrow
                  d="M 480 240 L 382 240"
                  label="taxes"
                  labelX={430}
                  labelY={256}
                  money
                />
              </>
            )}
          </>
        )}

        {financial && (
          <>
            <FlowBox
              x={40}
              y={318}
              w={130}
              h={44}
              label="Financial sector"
              tone="outline"
            />
            {showMoney && (
              <>
                <FlowArrow
                  d="M 96 264 L 100 314"
                  label="saving"
                  labelX={70}
                  labelY={292}
                  money
                />
                <FlowArrow
                  d="M 174 340 C 300 348, 430 314, 500 262"
                  label="investment funds"
                  labelX={330}
                  labelY={352}
                  money
                />
              </>
            )}
          </>
        )}

        {foreign && (
          <>
            <FlowBox
              x={470}
              y={318}
              w={146}
              h={44}
              label="Foreign sector"
              tone="outline"
            />
            {showMoney && (
              <>
                <FlowArrow
                  d="M 528 314 C 480 220, 430 96, 392 58"
                  label="export revenue"
                  labelX={434}
                  labelY={228}
                  money
                />
                <FlowArrow
                  d="M 366 64 C 410 118, 468 234, 516 312"
                  label="import spending"
                  labelX={402}
                  labelY={186}
                  money
                />
              </>
            )}
          </>
        )}
      </svg>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold">
        {showMoney && (
          <span className="inline-flex items-center gap-2 text-[#1d43ae]">
            <span className="h-0.5 w-7 rounded bg-[#2554e8]" /> Money flows
          </span>
        )}
        {showReal && (
          <span className="inline-flex items-center gap-2 text-[#8a4207]">
            <span className="h-0.5 w-7 rounded border-t-2 border-dashed border-[#b45309]" />{" "}
            Real flows
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Multiplier rounds                                                  */
/* ---------------------------------------------------------------- */

function MultiplierRounds({ values }: { values: ControlValues }) {
  const initial = num(values, "initial", 100);
  const mpc = num(values, "mpc", 0.75);
  const isTax = str(values, "type", "spending") === "taxes";
  const firstRound = isTax ? initial * mpc : initial;
  const multiplier = isTax ? mpc / (1 - mpc) : 1 / (1 - mpc);
  const total = initial * multiplier;

  const rounds = Array.from({ length: 9 }, (_, i) => firstRound * mpc ** i);
  const maxBar = rounds[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {rounds.map((amount, index) => (
          <div key={`round-${index + 1}`} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs font-bold text-oe-text-muted">
              Round {index + 1}
            </span>
            <div className="h-6 flex-1 rounded-md bg-oe-surface-elevated/70">
              <div
                className="flex h-full items-center rounded-md bg-[#2554e8] px-2"
                style={{ width: `${Math.max((amount / maxBar) * 100, 2)}%` }}
              >
                <span className="text-[11px] font-bold text-white">
                  {amount >= maxBar * 0.12 ? round1(amount) : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
        <p className="pl-16 text-xs font-medium text-oe-text-muted">
          … continuing forever, each round {Math.round(mpc * 100)}% of the last
        </p>
      </div>

      <div className="rounded-2xl border border-oe-border bg-oe-surface-elevated/60 px-5 py-4 text-sm leading-6 text-oe-text-muted">
        {isTax ? (
          <p>
            A tax cut of <strong className="text-oe-text">{initial}</strong>{" "}
            first raises spending by only MPC × {initial} ={" "}
            <strong className="text-oe-text">{round1(firstRound)}</strong> (the
            rest is saved). Total effect: {initial} × MPC/(1−MPC) = {initial} ×{" "}
            {round1(multiplier)} ={" "}
            <strong className="text-oe-text">{round1(total)}</strong>.
          </p>
        ) : (
          <p>
            New spending of <strong className="text-oe-text">{initial}</strong>{" "}
            becomes income, of which {Math.round(mpc * 100)}% is re-spent each
            round. Total effect: {initial} × 1/(1−MPC) = {initial} ×{" "}
            {round1(multiplier)} ={" "}
            <strong className="text-oe-text">{round1(total)}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Money creation                                                     */
/* ---------------------------------------------------------------- */

function MoneyCreation({ values }: { values: ControlValues }) {
  const deposit = num(values, "deposit", 1000);
  const rr = num(values, "rr", 10) / 100;
  const required = deposit * rr;
  const excess = deposit - required;
  const maxTotal = deposit / rr;
  const newMoney = maxTotal - deposit;

  const banks = Array.from({ length: 7 }, (_, i) => deposit * (1 - rr) ** i);
  const maxBar = banks[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-oe-border">
        <p className="bg-oe-surface-elevated px-4 py-2.5 text-center text-sm font-bold text-oe-text">
          First National Bank — T-account
        </p>
        <div className="grid grid-cols-2 divide-x divide-oe-border border-t border-oe-border text-sm">
          <div className="px-4 py-3">
            <p className="font-bold text-oe-text">Assets</p>
            <div className="mt-2 space-y-1.5 text-oe-text-muted">
              <p className="flex justify-between gap-3">
                <span>Required reserves</span>
                <span className="font-semibold text-oe-text">
                  {round1(required)}
                </span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Loans (excess reserves lent)</span>
                <span className="font-semibold text-oe-text">
                  {round1(excess)}
                </span>
              </p>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-oe-text">Liabilities</p>
            <div className="mt-2 space-y-1.5 text-oe-text-muted">
              <p className="flex justify-between gap-3">
                <span>Deposits</span>
                <span className="font-semibold text-oe-text">
                  {round1(deposit)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-oe-text">
          Deposit expansion as each loan is re-deposited
        </p>
        <div className="flex flex-col gap-2">
          {banks.map((amount, index) => (
            <div key={`bank-${index + 1}`} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs font-bold text-oe-text-muted">
                Bank {index + 1}
              </span>
              <div className="h-6 flex-1 rounded-md bg-oe-surface-elevated/70">
                <div
                  className="flex h-full items-center rounded-md bg-[#0b1f3a] px-2"
                  style={{ width: `${Math.max((amount / maxBar) * 100, 2)}%` }}
                >
                  <span className="text-[11px] font-bold text-white">
                    {amount >= maxBar * 0.14 ? round1(amount) : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-oe-border bg-oe-surface-elevated/60 px-5 py-4 text-sm leading-6 text-oe-text-muted">
        <p>
          Money multiplier = 1 ÷ {round1(rr * 100)}% ={" "}
          <strong className="text-oe-text">{round1(1 / rr)}</strong>. If every
          loan is re-deposited and banks hold no excess reserves, total deposits
          grow to <strong className="text-oe-text">{round1(maxTotal)}</strong> —
          of which <strong className="text-oe-text">{round1(newMoney)}</strong>{" "}
          is newly created money (the original {round1(deposit)} already
          existed).
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Balance of payments                                                */
/* ---------------------------------------------------------------- */

function BopBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const negative = value < 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-44 shrink-0 text-xs font-semibold text-oe-text-muted">
        {label}
      </span>
      <div className="relative h-6 flex-1 rounded-md bg-oe-surface-elevated/70">
        <div className="absolute inset-y-0 left-1/2 w-px bg-oe-border" />
        <div
          className={cn(
            "absolute inset-y-0 rounded-md",
            negative ? "right-1/2 bg-[#b45309]" : "left-1/2 bg-[#2554e8]",
          )}
          style={{ width: `${Math.min((Math.abs(value) / max) * 50, 50)}%` }}
        />
      </div>
      <span
        className={cn(
          "w-12 shrink-0 text-right text-sm font-bold",
          negative ? "text-[#8a4207]" : "text-[#1d43ae]",
        )}
      >
        {value > 0 ? `+${round1(value)}` : round1(value)}
      </span>
    </div>
  );
}

function BalanceOfPayments({ values }: { values: ControlValues }) {
  const exports = num(values, "exports", 60);
  const imports = num(values, "imports", 80);
  const netIncome = num(values, "netIncome", 0);
  const currentAccount = exports - imports + netIncome;
  const financialAccount = -currentAccount;
  const max = 110;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2.5">
        <p className="text-sm font-bold text-oe-text">Current account</p>
        <BopBar label="Exports (credit)" value={exports} max={max} />
        <BopBar label="Imports (debit)" value={-imports} max={max} />
        <BopBar label="Net income & transfers" value={netIncome} max={max} />
        <BopBar
          label="Current account balance"
          value={currentAccount}
          max={max}
        />
      </div>

      <div className="space-y-2.5 border-t border-oe-border pt-4">
        <p className="text-sm font-bold text-oe-text">
          Capital / financial account
        </p>
        <BopBar label="Net asset flows" value={financialAccount} max={max} />
      </div>

      <div className="rounded-2xl border border-oe-border bg-oe-surface-elevated/60 px-5 py-4 text-sm leading-6 text-oe-text-muted">
        <p>
          {Math.abs(currentAccount) < 0.5 ? (
            <>
              The current account is balanced, so no net asset flows are needed.
            </>
          ) : currentAccount < 0 ? (
            <>
              The current account runs a deficit of{" "}
              <strong className="text-oe-text">
                {round1(-currentAccount)}
              </strong>
              : the country buys more from the world than it sells. The gap is
              financed by a capital/financial account surplus of the same size —
              foreigners acquire{" "}
              <strong className="text-oe-text">
                {round1(financialAccount)}
              </strong>{" "}
              in domestic assets. The two accounts always sum to zero.
            </>
          ) : (
            <>
              The current account runs a surplus of{" "}
              <strong className="text-oe-text">{round1(currentAccount)}</strong>
              : the country sells more to the world than it buys. The extra
              earnings flow out as a capital/financial account deficit —
              residents acquire{" "}
              <strong className="text-oe-text">
                {round1(-financialAccount)}
              </strong>{" "}
              in foreign assets. The two accounts always sum to zero.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
