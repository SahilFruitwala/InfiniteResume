# AI Resume Analysis

InfiniteResume provides AI-powered resume analysis with two modes: standalone quality scoring and job description matching. Results are persisted in the database so users can revisit past analyses, and stale analyses are automatically flagged when resume content changes.

## Overview

| Property                | Detail                                                          |
| ----------------------- | --------------------------------------------------------------- |
| **AI Provider**         | Google Gemini (`gemini-2.5-flash`) or OpenRouter                |
| **API Key Model**       | BYOK — user's own key, never sent to our servers                |
| **Analysis Storage**    | Convex `resumeAnalyses` table                                   |
| **Staleness Detection** | djb2 content hash on resume save — marks analyses when outdated |
| **Instant Score**       | Client-side analyzer (~2600-line rule engine, always visible)   |

## Analysis Modes

### 1. Standalone (Resume-Only)

- Scores resume quality on content, format, impact, and keywords (0–100)
- Returns strengths, actionable improvements, and an executive summary
- **Only one** stored per resume — re-running replaces the previous analysis
- Stored with `type: "standalone"`

### 2. JD Match (Job Description)

- Everything from standalone, plus job-specific match scoring
- Extracts job title and company from the JD
- Returns matched keywords and missing keywords
- **Multiple** stored per resume — one per job description
- Stored with `type: "jd_match"`

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│ AnalysisTab │────▶│ AI Analyzer  │────▶│ Gemini/OpenRouter│
│ (React)     │     │ (BYOK fetch) │     │ (User's API key) │
└──────┬──────┘     └──────────────┘     └──────────────────┘
       │
       │ save result
       ▼
┌──────────────┐     ┌───────────────┐
│ Convex       │────▶│ resumeAnalyses│
│ analyses.ts  │     │ table         │
└──────────────┘     └───────┬───────┘
                             │
       ┌─────────────────────┘
       │ on resume save
       ▼
┌──────────────┐
│ resumes.ts   │── hash changed? ──▶ markStale()
│ save mutation│
└──────────────┘
```

## User Flow

### Running an Analysis

```
1. User opens builder with a saved resume
2. Navigates to Analysis tab in right sidebar
3. Quick Score is always visible (instant, client-side)
4. Clicks "Analyze Resume" or pastes JD + clicks "Analyze Match"
5. BYOK AI call fires using user's API key from Settings
6. Results are saved to Convex and displayed in an expandable card
7. For JD match: job title/company are auto-extracted from the JD
```

### Staleness Flow

```
1. User runs an AI analysis → result saved with content hash
2. User edits resume content (e.g. changes a bullet point)
3. User saves resume (Ctrl+S / auto-save)
4. resumes.save mutation:
   a. Computes new content hash (djb2, excludes design fields)
   b. Compares with stored hash
   c. If different → calls markStale() on all analyses for that resume
5. UI shows amber "Resume Updated" badge on stale analyses
```

### What Triggers Staleness

| Change Type                 | Triggers Staleness? |
| --------------------------- | ------------------- |
| Edit job title/description  | ✅ Yes              |
| Change personal info        | ✅ Yes              |
| Add/remove experience       | ✅ Yes              |
| Edit skills, projects, etc. | ✅ Yes              |
| Change font/spacing/colors  | ❌ No               |
| Change template             | ❌ No               |
| Reorder sections            | ❌ No               |

## Content Hash Algorithm

The hash function uses **djb2** — a fast, non-cryptographic hash sufficient for change detection.

```ts
function computeContentHash(content) {
  // Exclude design-only fields
  const { typography, spacing, theme, layout, ...contentFields } = content;
  const str = JSON.stringify(contentFields);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
}
```

This function exists in two places (must stay in sync):

- `convex/resumes.ts` — server-side, used during save
- `src/components/AnalysisTab.tsx` — client-side, used when saving analysis results

## Database Schema

### `resumeAnalyses` Table

| Field               | Type            | Description                                    |
| ------------------- | --------------- | ---------------------------------------------- |
| `resumeId`          | `Id<"resumes">` | Foreign key to the resume                      |
| `userId`            | `Id<"users">`   | Foreign key to the user (for authorization)    |
| `type`              | `string`        | `"standalone"` or `"jd_match"`                 |
| `jobTitle`          | `string?`       | Extracted from JD (jd_match only)              |
| `jobCompany`        | `string?`       | Extracted from JD (jd_match only)              |
| `jobDescription`    | `string?`       | Stored JD text, capped at 5000 chars           |
| `resumeContentHash` | `string`        | Hash of resume content at analysis time        |
| `isStale`           | `boolean`       | `true` if resume changed since analysis        |
| `overallScore`      | `number`        | 0–100 holistic quality score                   |
| `scoreBreakdown`    | `object`        | `{ content, format, impact, keywords }` (0–25) |
| `matchScore`        | `number?`       | 0–100 JD match percentage (jd_match only)      |
| `strengths`         | `string[]`      | 3–5 specific resume strengths                  |
| `improvements`      | `string[]`      | 3–5 actionable improvement suggestions         |
| `missingKeywords`   | `string[]?`     | Keywords from JD not found in resume           |
| `matchedKeywords`   | `string[]?`     | Keywords from JD found in resume               |
| `aiSummary`         | `string`        | 2–3 sentence executive summary                 |
| `createdAt`         | `number`        | Unix timestamp (ms)                            |

**Indexes:** `by_resume`, `by_resume_type`, `by_user`

### `resumes` Table (Modified)

| New Field     | Type      | Description                             |
| ------------- | --------- | --------------------------------------- |
| `contentHash` | `string?` | djb2 hash of content (excluding design) |

## File Structure

| File                                  | Purpose                                                    |
| ------------------------------------- | ---------------------------------------------------------- |
| `convex/schema.ts`                    | `resumeAnalyses` table definition + `contentHash`          |
| `convex/analyses.ts`                  | CRUD mutations/queries: save, list, get, remove, markStale |
| `convex/resumes.ts`                   | Content hash + staleness trigger in `save` mutation        |
| `src/app/utils/ai-resume-analyzer.ts` | BYOK AI function (Gemini/OpenRouter API calls)             |
| `src/app/utils/resume-analyzer.ts`    | Client-side instant analyzer (rule engine, ~2600 LOC)      |
| `src/components/AnalysisTab.tsx`      | Analysis tab UI: Quick Score + AI + History                |
| `src/components/RightSidebar.tsx`     | Hosts AnalysisTab, passes `resumeId`                       |

## Backend Functions (`convex/analyses.ts`)

| Function       | Type               | Description                                        |
| -------------- | ------------------ | -------------------------------------------------- |
| `save`         | `mutation`         | Upsert for standalone (deletes old), insert for JD |
| `listByResume` | `query`            | All analyses for a resume, ordered by date desc    |
| `get`          | `query`            | Single analysis by ID                              |
| `remove`       | `mutation`         | Delete an analysis                                 |
| `markStale`    | `internalMutation` | Bulk-mark all analyses for a resume as stale       |

## AI Prompt Structure

The AI receives:

1. **Resume text** — flattened from structured `ResumeData` via `flattenResumeData()`
2. **Job description** (optional) — raw text pasted by user

It returns structured JSON with scores, strengths, improvements, keywords, and a summary. The prompt enforces:

- Specific, evidence-based suggestions (not generic advice)
- Score breakdown across 4 dimensions (content, format, impact, keywords)
- For JD mode: job title/company extraction + keyword matching

## Prerequisites

- **API Key**: User must configure a Google Gemini or OpenRouter API key in Settings
- **Saved Resume**: Resume must be saved to Convex before AI analysis (need a `resumeId`)
- **Convex Dev Server**: Must be running (`bunx convex dev`) for DB operations
