# Open Economics Template

A frontend-only Next.js lesson UI template for economics review.

The current sample course is AP Microeconomics, with hardcoded mock lessons for
scarcity, production possibilities, supply and demand, firm behavior, factor
markets, and market failure. The app does not require Payload CMS, a database,
payments, authentication, email, Redis, Mux, or environment variables for local
development.

## Local Development

```bash
npm run dev
```

Open `http://localhost:3000` to view the Open Economics dashboard.

## Build

```bash
npm run build
```

## Included Course Paths

- AP Microeconomics
- AP Macroeconomics
- HL Economics
- SL Economics

Only AP Microeconomics is wired to complete mock lesson pages for now. The home
screen includes the full Open Economics catalog as a polished dashboard.

## Notes

- All lesson data is currently hardcoded in `lib/data/mock-courses.ts`.
- Economics graph data lives in `lib/data/economics-graphs.ts`.
- The Production Possibilities Frontier lesson uses a guided step flow with an
  editable graph configuration.
