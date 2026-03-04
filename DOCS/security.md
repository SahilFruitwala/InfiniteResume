**Security Documentation (What Changed, Why, and What Issues Were Fixed)**

### 1. XSS hardening for rendered resume content

**Issue**

1. Resume fields were rendered with `dangerouslySetInnerHTML` across templates.
2. Content came from user input and AI extraction output, but there was no sanitization guarantee.
3. This created an XSS path that could execute arbitrary script in the app context.

**What I changed**

1. Added centralized HTML sanitization utility using `isomorphic-dompurify`:
   [security.ts](/Users/sahil/Coding/InfiniteResume/app/utils/security.ts)
2. Sanitized all rich text before rendering in templates:
   [ProfessionalTemplate.tsx](/Users/sahil/Coding/InfiniteResume/app/components/templates/ProfessionalTemplate.tsx)  
   [AcademicTemplate.tsx](/Users/sahil/Coding/InfiniteResume/app/components/templates/AcademicTemplate.tsx)  
   [CreativeTemplate.tsx](/Users/sahil/Coding/InfiniteResume/app/components/templates/CreativeTemplate.tsx)  
   [ModernTemplate.tsx](/Users/sahil/Coding/InfiniteResume/app/components/templates/ModernTemplate.tsx)  
   [MinimalTemplate.tsx](/Users/sahil/Coding/InfiniteResume/app/components/templates/MinimalTemplate.tsx)
3. Sanitized editor input/output flow:
   [RichTextEditor.tsx](/Users/sahil/Coding/InfiniteResume/app/components/RichTextEditor.tsx)
4. Sanitized AI parse output before validation/use:
   [client-resume-parser.ts](/Users/sahil/Coding/InfiniteResume/app/utils/client-resume-parser.ts)  
   [parse-resume.ts](/Users/sahil/Coding/InfiniteResume/app/actions/parse-resume.ts)

**Why**

1. Prevent script injection from rich text fields.
2. Reduce risk of credential/session/token theft through injected JS.

---

### 2. Unsafe external link handling fixed

**Issue**

1. External URLs (website/social/project links) were built directly from user data.
2. Non-HTTP schemes (for example `javascript:`) were not centrally blocked.

**What I changed**

1. Added URL sanitization/normalization (`http/https` allowlist only):
   [security.ts](/Users/sahil/Coding/InfiniteResume/app/utils/security.ts)
2. Introduced a safe link wrapper and replaced template link usage:
   [SafeExternalLink.tsx](/Users/sahil/Coding/InfiniteResume/app/components/templates/SafeExternalLink.tsx)
3. Updated all templates to use `SafeExternalLink` instead of raw `href={...}` for user-controlled links.

**Why**

1. Prevent malicious URL schemes from being executed in browser navigation contexts.
2. Enforce consistent outbound-link security everywhere.

---

### 3. API key persistence risk reduced

**Issue**

1. BYOK API keys were persisted in `localStorage`.
2. If XSS occurred, those keys were easy to exfiltrate from storage.

**What I changed**

1. Removed persistent storage of API keys.
2. Keys now live in memory for the active tab session only.
3. Only provider preference is persisted.
4. Updated settings panel messaging to reflect the new behavior:
   [resume-extraction-settings.ts](/Users/sahil/Coding/InfiniteResume/app/utils/resume-extraction-settings.ts)  
   [ResumeExtractionSettingsPanel.tsx](/Users/sahil/Coding/InfiniteResume/app/components/ResumeExtractionSettingsPanel.tsx)

**Why**

1. Minimize secret lifetime and storage footprint in browser.
2. Limit blast radius if client-side compromise happens.

---

### 4. API key in URL query removed

**Issue**

1. Google API key was sent in request query string (`?key=...`).
2. Query-string secrets are easier to leak into logs/tooling/history.

**What I changed**

1. Switched to header-based auth for Google request (`x-goog-api-key`).
2. Added `referrerPolicy: "no-referrer"` for outbound model calls:
   [client-resume-parser.ts](/Users/sahil/Coding/InfiniteResume/app/utils/client-resume-parser.ts)

**Why**

1. Reduce accidental key exposure through URL logging surfaces.

---

### 5. Additional correctness fix discovered during hardening

**Issue**

1. Type narrowing bug in resume import error path.

**What I changed**

1. Fixed safe access of `ParseResult.error`:
   [ImportResume.tsx](/Users/sahil/Coding/InfiniteResume/app/components/ImportResume.tsx)

**Why**

1. Keep build/type-check stable after security refactor.

---

### 6. Dependencies and verification

**Added dependency**

1. `isomorphic-dompurify` in:
   [package.json](/Users/sahil/Coding/InfiniteResume/package.json)

**Validation performed**

1. `bun run lint` succeeded (only pre-existing warnings in generated Convex files).
2. `bunx tsc --noEmit` succeeded.

---

### 7. Security outcome and residual risk

**Improved**

1. XSS risk significantly reduced across render/edit/AI-import paths.
2. URL injection risk reduced via strict link sanitization.
3. API key leakage risk reduced by removing persistent client storage and query-string usage.

**Still true**

1. BYOK keys still exist in browser memory during active use.
2. Defense-in-depth would improve further with CSP/security headers and optionally moving all AI parsing server-side.

If you want, I can produce a short `SECURITY.md` in the repo with this exact model (threats, controls, residual risks, and maintenance checklist).
