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

## Suggested Implementation Order

1. **Tutorial/help screen** — Show available shortcuts before Level 1 so new players aren't lost
2. **Level restart** — Let players retry the current level without restarting the entire game
3. **More levels** — Add levels for Home/End, Shift+Arrow selections, and combined techniques
4. **Sound effects** — Audio feedback for key presses, germ removal, level completion
5. **Statistics dashboard** — Per-player accuracy, speed trends, improvement over time
6. **Alternate game modes** — Time trial, survival, or practice/sandbox mode
7. **Leaderboard filters** — Filter highscores by time period or level
8. **Replay viewer** — Play back recorded game history (data already captured)
9. **Achievements/badges** — Reward milestones like "no animals harmed" or "under 30 seconds"
10. **Accessibility** — Screen reader support, high-contrast theme, keyboard-only navigation
