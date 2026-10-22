# OpenAI AI grader (local prototype)

The IB Paper 1 question pages (`/practice/ib/[topic]`) offer **Grade with AI** after both written parts are filled in. Draft saving still works independently. Multiple-choice marking continues to use the existing answer keys.

## Configure locally

Add these server-only values to `.env.local` in this project, then restart the dev server:

```dotenv
OPENAI_API_KEY=your-key-here
OPENAI_GRADER_MODEL=gpt-6-sol
```

`.env.local` is ignored by Git. Do not paste the key into chat, put it in client code, or prefix it with `NEXT_PUBLIC_`. The model can be changed to a supported OpenAI model with structured outputs without editing the UI. This adapter follows OpenAI’s Responses API with strict structured outputs: https://developers.openai.com/api/docs/guides/structured-outputs

Open `/practice/ib/1-1`, write both responses, and submit. Before a key is configured, the page reports that the grader is unavailable and preserves the drafts. Live OpenAI grading still needs a configured key and an end-to-end test.

## Grading and data flow

- Browser sends topic, question ID and written answers to the same-origin Next.js endpoint.
- Server looks up the question and its private question-specific marking guide. Clients cannot supply rubrics or marks.
- Only the chosen question, relevant marking guide and submitted answers go to OpenAI. No account details, email, or draft library is included.
- The server validates structured feedback, bounds each mark, and adds part (a) /10 and part (b) /15 itself.
- Student text is treated as untrusted content. Prompt injection resistance is instructed, but model judgments must still be reviewed and calibrated against human grading.
- No diagrams or files are uploaded. Students can describe diagrams in text; feedback flags missing visual evidence.
- Results are shown in memory, not persisted. Editing a response hides stale feedback; navigating away cancels the request in the browser. Drafts remain browser-local.
- Provider errors never expose raw provider bodies or API keys. No answer text or guide content is logged by this implementation.

The private guides in `lib/ib-paper-one/grading-guides/` are currently local and Git-ignored. They must be packaged securely server-side for any deployment. Never copy them to `public/` or import them into a client component.

## Limits and AWS migration

This prototype accepts up to 20,000 characters per part, bounds the request body to 180 KB, uses a 55-second provider timeout, allows two concurrent requests, 20 requests per hour and 200 per day per server process. Requests share the local quota; forwarding headers are not trusted. These limits reset when the process restarts. Do not use them as distributed production quotas.

The endpoint deliberately returns 503 in production. For AWS, keep `GradingProvider` and the existing request/result contracts; replace the OpenAI adapter if desired. Before enabling production, add authenticated student access, shared quotas/rate limits, a managed secret, securely deployed guides, and any required durable submission storage. Review student-data handling for the chosen provider, and calibrate scoring with teacher-reviewed answers before treating marks as reliable.

Verification: `node node_modules/vitest/vitest.mjs run lib/ai-grader/grader.test.ts` and `node node_modules/typescript/bin/tsc --noEmit`.

The OpenAI adapter uses `gpt-6-sol`, low reasoning effort, and `store: false`. No tools are enabled. Provider retention policies still apply; `store: false` is not a claim of zero data retention.

## IB marking configuration and teacher references

Edit `lib/ai-grader/ib-paper-one.config.json` to review the versioned marking profile. It contains separate /10 and /15 markbands, the focus of each part, best-fit procedures, alternative-answer handling, real-world application and evaluation requirements, and text-only diagram limitations. The band descriptions are OEP summaries from the supplied teacher guides, not verbatim official descriptors. No invented numerical weights or automatic word-count penalties are applied. Marking principles were also checked against the IB's public Economics examiner instructions (Paper 1): https://ibpublishing.ibo.org/exinst/apps/exinst/index.html?chapter=2&doc=EX_instructions_2022_e&part=11

The current private reference set is extracted from the 30 supplied teacher PDFs, matched against their 30 student PDFs and every live question stem (1,290 pairs). Each question has separate `answerReferences.a` and `.b`. General topic guidance remains included, including any scope exceptions. These are indicative answer/marking references, not teacher-scored student scripts. No claim of examiner calibration is made.

To re-extract after a source update:

```sh
python scripts/configure-ib-grader.py /path/to/pdf-directory
```

This validates all topic IDs, question IDs, teacher/student/live stems, and both answer-reference sections before writing any guide. It does not overwrite student-facing questions. Source PDF filenames and SHA-256 hashes are recorded privately with each guide and in the content-free `audit/ib-grader/source-import.json` report. Keep using this configuration script after any general bank re-import, since the earlier importer does not extract structured answer references.

Feedback includes the server-derived markband, explanation of alignment with the answer guidance, and up to three exact student quotations per part. The server rejects evidence not found in the submitted part. Results include the rubric version and source hash for traceability; the browser never receives the underlying teacher answer text. The same markbands apply to SL/HL, with the actual question's level and scope supplied to the model. No overall 1–7 IB grade is inferred.

Tests: run `node node_modules/vitest/vitest.mjs run lib/ai-grader/grader.test.ts lib/ai-grader/ib-profile.test.ts`. They verify score bounds, evidence validation, configuration coverage and all 1,290 reference matches. Live smoke checks compare a synthetic developed answer with an irrelevant response; these checks establish operation, not accuracy against teacher-marked scripts. Teacher-scored exemplars and blind comparisons would be needed for that next step.
