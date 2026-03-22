# Typo Terminator — Next Features

## Recommended Features

### 1. Text Selection Levels (High Impact, Medium Effort)

The biggest gap in the curriculum. Selection (Shift+Arrow, Shift+Ctrl+Arrow) is one of the most used editing skills and a natural "next chapter" after navigation and deletion.

**Changes:**
- **`src/app/virtualTextarea/index.ts`** — Add `selectionAnchor: number | null` to the return type of `calcTextarea`. Handle Shift+Arrow (character selection) and Shift+Ctrl+Arrow (word selection). Backspace/Delete on a selection removes the range.
- **`src/app/screens/LevelScreen.tsx`** — Render selection highlight in GameMap. Add Shift combo entries to `keyText` and `keyCombinationExplanation`.
- **`src/app/engines/level.ts`** — Extend `handleKeyDown` to support `pressedModifierCount === 2` (Shift+Ctrl).
- **`src/app/levels/index.ts`** — Add 2-3 new levels: Shift+Arrow basics → Shift+Ctrl+Arrow → combined select-and-delete.
- **Tests** — Extend `virtualTextarea/index.test.ts` with selection cases. Update E2E tests.

### 2. Home/End Key Navigation (Medium Impact, Small Effort)

Home/End (line-level navigation) complements the existing word-level navigation. On Mac these map to Cmd+Left/Right — introduces the last major modifier.

**Changes:**
- **`src/app/virtualTextarea/index.ts`** — Add Home/End handling (move to line start/end). Add Ctrl+Home/End (document start/end).
- **`src/app/levels/index.ts`** — 1-2 new levels.
- **`src/app/utils/index.ts`** — May need a `cmdEquivalentPressed` helper for Mac Cmd key mapping.
- **`src/app/screens/LevelScreen.tsx`** — New KeyCombinationTag entries.

### 3. Level Retry Without Full Restart (Medium Impact, Small Effort)

Currently failing a level triggers `window.location.reload()` — punishing and discouraging. Allow retrying the current level.

**Changes:**
- **`src/app/engines/game.ts`** — Add `retryCurrentLevel` that resets level state without changing level number.
- **`src/app/screens/FailedLevelScreen.tsx`** — Add "Retry Level" button.
- **`src/app/screens/FinishedLevelScreen.tsx`** — Optionally add "Replay Level" for score improvement.

### 4. Keystroke Statistics & Feedback (Medium Impact, Small-Medium Effort)

The game already records every keystroke with timestamps via `useGameHistory`. Surface this as player stats: keystrokes per minute, efficiency ratio, wasted keystrokes.

**Changes:**
- New stats utility function analyzing `IKeyRecording` data.
- **`src/app/screens/EndScreen.tsx`** — Show stats summary.
- **`src/app/screens/FinishedLevelScreen.tsx`** — Per-level stats.
- **`src/app/components/LevelResultsBar.tsx`** — Extend with optional stats display.

### 5. Fix Existing Technical Debt (Low Impact, Small Effort)

- **`src/app/screens/LevelScreen.tsx:145`** — Fix the `@ts-expect-error` by replacing the nested reduce with a flat `Record<string, string>` lookup map.
- **`e2e-tests/game.spec.ts:100`** — Investigate and fix the Safari/webkit test skip.
- Clean up unused font imports in `layout.tsx`.
