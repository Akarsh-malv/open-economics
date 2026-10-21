/** Organization figures supplied by the site owner, October 21, 2026. */
export const impactFigures = {
  activePartnerships: 26,
  learnersServed: 8357,
  fundingReceived: 5000,
  estimatedCostsAvoided: 6000,
} as const;

const number = new Intl.NumberFormat("en-US");
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

export const impactMetrics = [
  { value: number.format(impactFigures.activePartnerships), label: 'Active partnerships', description: 'Institutional relationships' },
  { value: number.format(impactFigures.learnersServed), label: 'Learners served', description: 'Access to economics learning' },
  { value: currency.format(impactFigures.fundingReceived), label: 'Funding received', description: 'Contributions supporting OEP' },
  { value: currency.format(impactFigures.estimatedCostsAvoided), label: 'Estimated costs avoided', description: 'Estimated savings through open access' },
] as const;
