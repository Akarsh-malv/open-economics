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
- Bundled Manrope, OFL license, transparent logo assets, signature and labeled illustrative artwork. The 8.3K learners badge is displayed in the academy hero at the user’s request; it is presentation copy, not a live backend count.
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


## Academy screenshot alignment — October 21, 2026

The shared learning sidebar now separates Overview, My learning, Practice, Discover and Learn with labeled groups and consistent row spacing. The shared course-family selection persists between academy pages. Six reference-style pathways connect to existing course, practice and studio destinations; the Cambridge card opens the available A-level bank, and the IB learning card opens the existing SL/HL catalog.

The dashboard and practice landing page share the colored pathway cards. Saved questions and mistakes appear in simultaneous panels, populated from the existing browser history and question deep links. Specialisms use the full two-column concept grid. The Olympiad studio includes the reference hero, rings, working track tabs, practice loop, sample case and recording placeholder. Native video-preview dialogs support Escape and focus return. The user-requested 8.3K learners display and Manrope remain in place. APIs, grading handlers, schemas and question data were not edited.

Validation: TypeScript passes; four existing history/import tests pass. Browser review covers all five affected pages at 1440px and 390px without horizontal overflow. Interaction checks verify family selection across navigation, the A-level bank destination, track switching, case navigation, video dialogs, browser-history records and question deep links, and the mobile drawer. Captures and the audit report are in `audit/reference-match/`. Changes are local; no deployment was performed.


## Stories & Insights and public footer — October 21, 2026

Integrated the supplied `OpenEconomics-Blog-Only.zip` into native `/stories` and three `/stories/[slug]` routes. Article text, categories, sample/draft labels and CSS artwork come from the archive preserved under `reference/blog-only/`. Content is maintained in `lib/journal/articles.json`. Shared Manrope, navigation and the public footer are reused. The imported blog styles are scoped to `.oe-journal`; the standalone scripts, global CSS resets and duplicate font definition are not shipped.

React controls provide category filtering, article section jumps with focus, a current-section indication, related articles, and copying an article URL with a manual-copy fallback. The Our Story CTA links to the existing homepage story section. Draft robots metadata is retained, so these preview articles are excluded from the search sitemap.

The public navigation and footer now include Stories. The public footer restores the user-approved 8.3K learner laurel badge and adds Follow OEP, linking to `https://www.instagram.com/open_economics/?hl=en` in a new tab. The Instagram icon is a local SVG. No backend, account or grading code was changed.

Validation: TypeScript passes. The listing, all three articles and homepage returned HTTP 200 with Manrope, one footer, one learner badge and no horizontal overflow at 1440px, 768px and 390px. Browser checks cover categories/counts, article links, section jumps/focus, copy link, related articles, mobile menu navigation, the homepage story CTA and unknown-article HTTP 404. Captures and checks are in `audit/blog/`. No deployment was performed.

## October 21: impact figures and Terms of Use
- Shared homepage/impact metrics now show owner-supplied totals: 26 partnerships, 8,357 learners, $5K funding, $6K estimated costs avoided.
- Removed wording describing the website as a UI/design preview. Retained placeholder profiles, testimonials, media and program concepts at the owner's request.
- `/terms` now renders the supplied July 23 Word document, preserving all 162 nonempty paragraphs, 21 numbered sections, two account subsections, emphasis, lists, hyperlinks and manual line breaks. The supplied effective and updated dates remain intact.
- Reimport source with `scripts/import-terms.py`; document data is stored in `lib/policies/terms.json`.
- TypeScript passed. Browser checks confirmed exact rendered paragraph text, all 21 sections, contents navigation, and no overflow at 1440px and 390px.
