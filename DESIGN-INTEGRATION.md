# OpenEconomics blueprint integration

Local implementation only; no deployment, database writes or schema changes.

| Blueprint | Application destination | Existing service | Adaptation |
|---|---|---|---|
| NGO pages, people, programs, policies | /, /work, /people, /impact, /involved and supporting pages | No organizational records/submission service present | Preserve labeled draft/demo content; React state for controls; email draft for enquiries |
| Academy dashboard/catalog | /learn, /learn/courses; existing /courses | lib/data/courses.ts | Existing catalog; no invented enrollment/analytics |
| Lessons | /course/[courseName]/[lessonName] | Existing course layout, content and completion mechanisms | Keep lesson layout and URLs; academy navigation |
| Practice/review | /practice and /learn/saved, /learn/analytics | lib/practice/bank.ts, existing /api/practice endpoints, oe-practice-* localStorage | Preserve all banks, server grading, browser history; aggregate only actual stored attempts |
| Interactive graph lab | /graphs and /graphs/[graphId] | lib/graphs, existing graph controls/calculation engine | Preserve full library and calculation/reset logic |
| Auth/account/admin | Existing /auth/*, /account, /admin | Existing implementation | Do not alter permissions; current auth/session and feedback services are mocks |
| Specialist discovery, olympiad, videos | /learn/explore, /learn/specialism/*, /learn/olympiad | Existing foundational lessons/graphs | Explicit concept/video placeholders; link to real learning tools |
| Flashcards/guides/tests | /learn/flashcards, /learn/guides, /learn/tests | Existing lesson and practice content | Reuse introductory concepts and existing practice grading; no invented exam scores |

Implementation sequence: preserve source snapshot; import assets and scoped design system; translate public layouts into React data/components; add native interaction islands; add academy shell and real history summaries; verify types, banks, graph tests, routes and desktop/mobile rendering.

The blueprint's scripts run only in a one-time local extraction tool to produce declarative component data. Neither script, hash router, DOM event system nor prototype question library ships as the application. The app uses Next routes and React state.

## Implemented

- Native Next.js NGO pages and OEP Learn navigation; old course/practice/graph URLs retained. Learn aliases redirect to the existing content routes.
- All 13,100 existing questions across 131 AP Macro, AP Micro and A-level topics retained. Server answer validation/grading and graph definitions are unchanged.
- Existing lesson catalog and approved lesson layouts retained; course overviews now have native resource tabs and links to real banks.
- Actual browser-history analytics, saved questions and mistakes; deep links reopen the exact question. Existing storage keys/revisions are preserved.
- Browser-only lesson completion is explicitly labeled and reflected in course overviews. No account sync or backend completion API was invented.
- Bundled Manrope, OFL license, transparent logo assets, signature and labeled illustrative artwork. Unapproved 8.2k badge is suppressed.
- Native React country filtering, profile dialogs, carousels, program-audience toggle, policy section tracking, flashcards and Olympiad track selection.
- Contact/enquiry form validates and composes an email draft to the existing published contact address. It does not claim a server submission succeeded.

## Known source limitations

Authentication/session and account actions already use mock implementations in this source copy. Course services use the existing local catalog. Feedback is also a mock response. These were preserved, not represented as verified production integrations. Real account authentication, synchronized progress/history and an application-submission service require approved production integrations. Approved organizational profiles, testimonials, policies, partner records and recordings are not present; blueprint placeholders/drafts remain explicitly labeled. Specialist courses are concepts; timed exam simulations and a live AI tutor are not implemented or falsely advertised.

## Local preview

From the project folder, use `pnpm dev --webpack --hostname 127.0.0.1 --port 3010`, then open `http://127.0.0.1:3010` (initiative) or `/learn` (academy). Webpack bypasses a Turbopack subprocess-spawn problem encountered on this local host. No migrations, new packages, API credentials or environment variables were introduced. Existing backend deployment configuration is unchanged.

## Verification so far

- TypeScript: passes.
- Practice/graph/history regression suite: 534 tests pass in 11 files.
- Focused Playwright integration suite: 7 tests pass, including actual grading and invalid-answer rejection, bookmark persistence and review deep links, real stored-history summaries, public/academy navigation, profile filtering/dialogs, audience toggle, testimonial controls, policy anchors, mobile graph reset and the existing account-access redirect.
- Browser route sweep: 32 public/academy/content routes returned HTTP 200; no browser console errors in that sweep.
- Mobile review found a generic-grid conflict between prototype CSS and the existing graph lab. The rule is now restricted to reference-page/native academy content; the mobile graph regression passes with no horizontal overflow.
- SHA comparison against the previously pushed source: all 152 compared practice/graph files are unchanged.
- The initial production build identified missing native macOS Sharp binaries in the copied Windows node_modules. The matching optional binaries were restored in /tmp for verification only; dependency manifests/lockfiles were not changed.

## Final build result

Production build passes with webpack: compilation, TypeScript, page-data collection, 289/289 prerendered pages and build tracing complete. The social-image helper now accepts filesystem paths and cross-realm URL objects, and the social-image routes use explicit public asset paths; a regression test covers this build failure. Default site metadata now describes the initiative and OEP Learn rather than the old frontend template.

Final regression totals: 535 tests in 12 files passed, plus 7 focused browser integration tests. The local production preview runs on http://127.0.0.1:3010. Desktop/mobile review images are stored in audit/redesign/.

This is a locally validated design integration, not a claim that mocked authentication or organizational draft content is ready for a production launch. No GitHub push, deployment or live-data change was performed, following the attached prompt's local-only default.

Final production-preview visual sweep: all 16 desktop/mobile captures (1440px and 390px) have no horizontal overflow and no browser console errors. The graph selector contains all 68 original graph models. Screenshots include home, people, get involved, policies, academy dashboard, course overview, practice and graphs. The production preview remains running for review.

A final screenshot review also found the blueprint's unlayered button-color/font reset overriding existing Tailwind graph/practice controls. The redundant reset was removed; generic paragraph colors are now scoped to the reference/native academy content. A browser assertion checks that selected graph-control text remains white against the navy background.

After the contrast correction, the production build passed again. The production-preview browser suite passed all 7 tests (including the new selected-control contrast assertion), and all 16 refreshed screenshots again showed no horizontal overflow or browser console errors.

## Follow-up: desktop graph library restoration

The imported `.hidden !important` rule still hid the old responsive desktop graph index even though its 68 models were present. This left the workspace auto-placed in the narrow first grid column. GraphLab now uses a dedicated CSS module with container-based responsive layout, and the prototype hidden/input rules are scoped away from the production lab. The desktop library/search, drawing and controls are visible; narrower layouts expose the complete picker. Graph calculations, model definitions and saved in-session controls were retained. Graph detail URLs retain the Graphs breadcrumb.

Verification: production build passes, 214 graph unit tests pass and all 10 browser tests pass. New coverage clicks all 68 models in the visible desktop index, measures each rendered drawing, checks the PPC at the reported 2374px viewport, and selects a macro model at 900px and 390px. Screenshots and logs: audit/redesign/graph-fix/.

## IB Economics Paper 1 question bank

The supplied 30 student PDFs and 30 matching teacher guides are imported by `scripts/import-ib-paper-one.py`. It validates continuous question numbering, both 10- and 15-mark parts, and a matching guide entry for each pair. The student-facing bank contains 1,290 original question pairs in `lib/ib-paper-one/topics/`, with topic metadata in `manifest.json`. Extracted teacher guidance stays in the local, git-ignored `lib/ib-paper-one/grading-guides/` directory. It is not needed by the current site and is not published to the repository or browser. Re-run the importer against the supplied PDFs when the source material changes.

The IB card and `/practice/ib` list all 30 available topics. Each topic route `/practice/ib/[topic]` offers the original part (a) and (b) prompts, SL/HL filtering, question navigation, and drafts saved only in that browser. The HL and SL course resource tabs link to the same topic bank. No Gemini key, scoring API, model answer, or automatic feedback is configured yet. The guides remain source material for the later rubric-aware grader.
