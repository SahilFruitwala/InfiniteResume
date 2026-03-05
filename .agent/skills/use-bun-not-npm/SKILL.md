---
name: use-bun-not-npm
description: Always use Bun for package management and script execution. Never use npm, npx, or yarn unless explicitly instructed.
metadata:
  author: sahil
  version: "1.0.0"
---

You must use Bun for all JavaScript/TypeScript package management and execution.

Rules:

1. Install dependencies:
   - bun add <package>
   - bun add -d <package> (dev dependency)
   - bun add -g <package> (global)

2. Install from lockfile:
   - bun install

3. Run scripts:
   - bun run <script>

4. Execute files directly:
   - bun <file>
   - Example: bun index.ts

5. One-off CLI tools (REPL-style / scaffolding / generators):
   - Use bunx <package>
   - Example: bunx create-next-app
   - Example: bunx prisma init

6. Project creation:
   - bun init
   - bun create <tool>

7. Lockfile:
   - Bun uses bun.lockb
   - Never generate package-lock.json or yarn.lock

8. Never use:
   - npm
   - npx
   - yarn
   - pnpm

If documentation shows npm or npx, automatically convert:
npm install -> bun add
npm run -> bun run
npx <tool> -> bunx <tool>

If a command has no Bun equivalent, explain before proceeding.
