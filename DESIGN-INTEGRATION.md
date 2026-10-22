# OpenEconomics blueprint integration

Local implementation only; no deployment, database writes or schema changes.

| Blueprint | Application destination | Existing service | Adaptation |
|---|---|---|---|
| NGO pages, people, programs, policies | /, /work, /people, /impact, /involved and supporting pages | No organizational records/submission service present | Preserve labeled draft/demo content; React state for controls; email draft for enquiries |
| Academy dashboard/catalog | /learn, /learn/courses; existing /courses | lib/data/courses.ts | Existing catalog; no invented enrollment/analytics |
| Lessons | /course/[courseName]/[lessonName] | Existing course layout, content and completion mechanisms | Keep lesson layout and URLs; academy navigation |
| Practice/review | /practice and /learn/saved, /learn/analytics | lib/practice/bank.ts, existing /api/practice endpoints, oe-practice-* localStorage | Preserve all banks, server grading, browser history; aggregate only actual stored attempts |
| Interactive graph lab | /graphs and /graphs/[graphId] | lib/graphs, existing graph controls/calculation engine | Preserve full library and calculation/reset logic |
| Authentication and accounts | Removed | The previous sign-in and account flow used mock sessions | No account UI or authentication endpoints are published; AI grading remains disabled in production |
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

## Privacy Policy
- `/privacy` now displays the owner-supplied Privacy Policy Word document using the same shared reader as Terms of Use.
- Preserves 344 paragraphs, the introduction and 21 numbered sections, nested headings, 90 list items, hyperlinks, emphasis and line breaks.
- Publication/revision date placeholders remain exactly as provided in the document. No dates or legal wording were invented.
- Import: `scripts/import-terms.py --policy privacy --source '/path/to/OEP Privacy Policy [July 23].docx'`.
- Verified all rendered paragraphs against the imported content and independently compared the import with DOCX XML. Browser checks passed for Privacy and Terms, contents navigation, lists and mobile/desktop overflow. TypeScript passed.

## October 22: remaining policy documents and dates
- Imported Content Licensing (233 paragraphs), Accessibility (63 paragraphs), and How We Measure Impact (158 paragraphs) into `/licensing`, `/accessibility`, and `/methodology` using the shared policy reader. Exact text independently compared against DOCX XML.
- Privacy effective date is February 9, 2025; last updated July 23, 2026, as supplied in the owner's screenshot. Importer preserves these explicit overrides on future imports.
- Removed Safeguarding route, policy tab and footer link. Supplied policy references remain as text with the removed destination disabled. Valid cross-policy links now navigate within the website.
- Set shared policy article width to 100% to prevent intrinsic-width overflow on mobile.
- TypeScript passed after regenerating route types and removing stale generated types for the deleted route. Browser checks cover all five policy documents, full text, list counts, section navigation and 1440px/390px layouts. Existing catch-all displays its not-found page for the removed URL.

## October 22: manifesto
- Replaced `/manifesto` with an editorial page built around the owner-supplied manifesto PDF and design brief.
- Centered OEP bracket mark, oversized declaration, lighter promise, 16:9 navy film placeholder, focused prose column, central principle and navy closing declaration. Uses Manrope and existing OEP navy with no animated graphics or card grids.
- Full manifesto wording matches the PDF after whitespace normalization. The video is intentionally a placeholder at the owner's request. `manifestoVideoId` in `lib/manifesto.ts` enables the lazy-loaded YouTube privacy-enhanced embed when an ID is supplied.
- Styles are scoped to the manifesto component. Existing header, footer, routes and backend behavior retained.
- TypeScript passed; browser checks cover exact PDF wording, Manrope, 16:9 aspect ratio and overflow at 320/390/768/1440/1920px. Visual QA reviewed the source PDF and desktop/mobile layouts.

## Manifesto design iteration
- Adapted the supplied HTML reference into scoped Next.js components: warm paper canvas, margin section labels, framed rhetorical contrast, emphasized conviction passage, branded film watermark and stamp, inset closing panel and corner details.
- Retained the existing site header/footer, full PDF wording, OEP mark, video placeholder and future embed configuration. All text remains Manrope, including section labels and italic passages; alternate font imports, font switcher and demo video player were not imported.
- Added a gold reading progress hairline at the top. Native CSS scroll timeline provides immediate progress, with a requestAnimationFrame-based fallback and event cleanup.
- Removed the faint outer vertical frame lines at the owner's request. Retained the intentional callout and section rules.
- Browser checks passed for exact PDF text, Manrope on all manifesto text, no overflow at five widths, 16:9 placeholder, scroll progress and no progress indicator on other pages. Shared footer manifesto link retained.

## Manifesto third section and CSS word reveals
- Third section now matches the supplied full-width navy reference: no inset card, corner marks, resolve label or signature pill; muted italic Manrope middle line, restrained gray divider, plain OEP signature and generous vertical space.
- Added server-rendered word spans with native CSS view-timeline animations. Words fade and rise into place progressively as their text enters the viewport. No animation library or JavaScript is used for text reveals.
- Unsupported browsers and reduced-motion preferences display all text normally. PDF wording remains unchanged and text remains selectable.
- Verified actual word opacity before/during/after scroll (0 → staggered partial opacity → 1), reduced-motion behavior, full-width geometry, exact text, Manrope and five responsive sizes. TypeScript passed.

## Manifesto label and closing-line refinements
- Replaced the two marginal section titles/descriptions with large Manrope Roman numerals I and II.
- Combined the first two closing sentences into one desktop line, preserving the italic treatment of “The barriers are.” Narrow screens wrap naturally.
- TypeScript and five-width browser checks passed, including explicit checks for the numeral labels and shared desktop line. Full wording, CSS reveals and reading progress retained.
- Restarted the local preview and cleared only generated Webpack caches after the node_modules layout changed to pnpm and left stale module paths in the running server.

## Homepage community card
- Moved “Discover our mission” from the hero card to the heading column of the following Our Story section. Link still opens `/manifesto`.
- Hero card now displays the owner-supplied 8,357 learners-served total, plus explicitly labeled sample signup activity with 250 fictional names.
- Names use a shuffled queue with no repeats until the cycle is exhausted, and no adjacent repeats at cycle boundaries. Each rotation uses a new random 180–240 second delay; hidden tabs skip notices and unmount clears the timeout. Generated activity does not increment the supplied total or create account records.
- Unit checks cover name uniqueness, cycle boundaries and delay bounds. Accelerated browser-clock checks confirmed no update before three minutes, update by four minutes and continuing rotation. Desktop/tablet/mobile checks and TypeScript passed.
- Browser timer verification used `http://localhost:3010/` so the development server's origin checks permit hydration.

## Website views display refinement
- Owner-selected baseline changed to 2,543,271; counter advances locally by one every six seconds (five per thirty seconds). Browser storage uses a new versioned key so the former 12-million baseline cannot carry over.
- Removed public demo/simulation labels at the owner's request. This remains a browser-local scheduled display, not an analytics integration or shared server-side measurement.
- Every digit reel rolls upward each tick, including unchanged positions. Only the units value normally changes; arithmetic carries update higher positions as necessary.
- Browser checks passed for the baseline, all seven animated columns, one normal changed digit, five-view pace, carry from 2,543,279 to 2,543,280, saved-value loading, reduced motion and mobile widths. TypeScript passed.

## Global network and public copy cleanup

- The home globe now shows all 25 requested countries, with geographically aligned markers, sparse connections, and three restrained anchor halos. A globe-specific map asset corrects dateline seams without changing the map used elsewhere.
- Removed public UI qualifiers describing content as conceptual, illustrative, demo, sample, draft, or a design preview. Kept actual learning activity names, input hints, and supplied policy text.
- Verified all 25 markers, accessible country names, clipping, and horizontal overflow at 1440, 1024, 768, 390, and 320 pixels. TypeScript passes.

## Get Involved source integration

- Rebuilt `/involved` from the supplied Get Involved HTML and screenshots, keeping the shared header/footer and Manrope.
- Imported the seven supplied role records with complete mandates, responsibilities, candidate profiles, roadmaps, commitments and Tally application URLs. Native `/involved/[role]` pages support direct links and browser navigation.
- Simplified the final testimonial section to one quote, attribution, slide count and previous/next buttons. Removed the right-side snapshot, avatar, tags, tab strip, and decorative panel.
- Checked all role filters, seven detail pages and application links, testimonial controls, the manifesto link, and widths 1440, 1024, 768, 390 and 320. TypeScript passes.
