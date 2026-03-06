<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into InfiniteResume. Here is a summary of all changes made:

- **`posthog-js` and `posthog-node`** were installed as dependencies.
- **`src/instrumentation-client.ts`** — PostHog is initialized here (below existing Sentry init) using the Next.js 15.3+ `instrumentation-client.ts` pattern. Automatic exception capture and session replay are enabled.
- **`next.config.ts`** — Added `/ingest` rewrites so all PostHog requests are proxied through the Next.js server, avoiding ad-blockers. Also added `skipTrailingSlashRedirect: true`.
- **`src/lib/posthog-server.ts`** — New server-side PostHog client using `posthog-node`, ready for use in Server Actions and API routes.
- **`src/app/builder/page.tsx`** — User identification via Clerk user ID on mount; `resume_saved`, `resume_downloaded`, and `template_changed` events added to their respective handlers.
- **`src/components/ImportResume.tsx`** — `resume_imported` event on successful PDF parse; `resume_import_failed` with `error_type` property + `captureException` on failure.
- **`src/app/dashboard/page.tsx`** — `resume_duplicated` and `resume_deleted` events added to their respective handlers.
- **`src/components/AnalysisTab.tsx`** — `ai_analysis_run` and `ai_jd_match_run` events added after successful AI analysis saves; `captureException` added in catch blocks.
- **`src/components/landing/Pricing.tsx`** — Converted to a client component; `pricing_cta_clicked` event with `plan`, `price`, and `cta_text` properties added to each CTA link.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` added.

| Event Name | Description | File |
|---|---|---|
| `resume_saved` | Fired when a user saves their resume (first save and subsequent saves) | `src/app/builder/page.tsx` |
| `resume_downloaded` | Fired when a user downloads/prints their resume as PDF | `src/app/builder/page.tsx` |
| `template_changed` | Fired when a user switches resume templates in the builder | `src/app/builder/page.tsx` |
| `resume_imported` | Fired when a user successfully imports a PDF resume via AI parsing | `src/components/ImportResume.tsx` |
| `resume_import_failed` | Fired when PDF resume import fails (invalid key, quota, or parse error) | `src/components/ImportResume.tsx` |
| `resume_duplicated` | Fired when a user duplicates an existing resume from the dashboard | `src/app/dashboard/page.tsx` |
| `resume_deleted` | Fired when a user permanently deletes a resume from the dashboard | `src/app/dashboard/page.tsx` |
| `ai_analysis_run` | Fired when a user runs standalone AI deep analysis on their resume | `src/components/AnalysisTab.tsx` |
| `ai_jd_match_run` | Fired when a user runs an AI job description match analysis | `src/components/AnalysisTab.tsx` |
| `pricing_cta_clicked` | Fired when a visitor clicks a pricing plan CTA button on the landing page | `src/components/landing/Pricing.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/158679/dashboard/1336063)
- **Insight**: [Resume Saves & Downloads (Daily)](https://us.posthog.com/project/158679/insights/hjRH3xJ6)
- **Insight**: [Conversion Funnel: Pricing CTA → First Resume Saved](https://us.posthog.com/project/158679/insights/kQOXqBFA)
- **Insight**: [AI Feature Usage (Daily)](https://us.posthog.com/project/158679/insights/QWuRGEs1)
- **Insight**: [Resume Lifecycle Actions (Weekly)](https://us.posthog.com/project/158679/insights/BsvNbfyd)
- **Insight**: [Import → Save → Download Funnel](https://us.posthog.com/project/158679/insights/vSr303lU)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
