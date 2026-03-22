# Typo Terminator

A web-based game for practicing text editing keyboard shortcuts. Players remove germ emojis from text using keyboard combos (Ctrl+Backspace, Ctrl+Arrow, etc.) while preserving animal emojis.

## Priority Guidelines

- Run `npm test` and `npm run lint` before committing
- Levels are data, not code — add new levels by adding entries to the levels array
- Cross-platform: Ctrl on Windows maps to Option on Mac via `ctrlEquivalentPressed`
- Anti-cheat: game history is replayed server-side to validate scores
- Keep the virtual textarea as a pure function — no UI coupling

## Commands

- `npm run dev` — Start dev server
- `npm test` — Run unit tests (Vitest)
- `npm run e2e` — Run E2E tests (Playwright)
- `npm run lint` — Lint with ESLint
- `npm run build` — Production build

## Architecture

- **Framework:** Next.js + React + TypeScript + Tailwind CSS
- **Backend:** DynamoDB for highscores, API routes at `src/app/api/`
- **Game engine:** Custom React hooks in `src/app/engines/` (game, level, history, highscore)
- **Text engine:** `src/app/virtualTextarea/` — pure function handling cursor movement and text editing
- **Levels:** Data-driven in `src/app/levels/index.ts`
- **Screens:** Start → Level → FinishedLevel/FailedLevel → End
