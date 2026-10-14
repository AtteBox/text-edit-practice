import { describe, it, expect, afterEach } from "vitest";
import {
  calcPoints,
  ILevel,
  isLevelGoalReached,
  isLevelTimedOut,
} from ".";

function aLevel(overrides: Partial<ILevel> = {}): ILevel {
  return {
    title: "Test",
    description: "Test",
    startContent: ["🐶 🦠 🐱"],
    allowedKeyCombinations: [["ctrl", "Backspace"]],
    cursorStartPos: "end",
    postLevelMessage: "",
    targetTimeSeconds: 60,
    pointCoefficient: 100,
    ...overrides,
  };
}

function aLevelState(overrides: Record<string, unknown> = {}) {
  return {
    germs: 0,
    animals: 0,
    startTime: 0,
    elapsedTime: 0,
    levelFinished: false,
    isPaused: false,
    gamePauses: [],
    ...overrides,
  };
}

describe("calcPoints", () => {
  it("does not produce NaN for levels without germs", () => {
    const level = aLevel({ startContent: ["🐶 🐱"] });
    const state = aLevelState({ germs: 0, animals: 2, elapsedTime: 0 });
    const points = calcPoints(state, level);
    expect(Number.isNaN(points)).toBe(false);
    expect(points).toBeGreaterThanOrEqual(0);
  });

  it("does not award points for extra animals beyond the level total", () => {
    // start has 2 animals, but state reports 4 (e.g. pasted duplicates)
    const level = aLevel({ startContent: ["🐶 🐱"], targetTimeSeconds: 1000 });
    const extraAnimals = aLevelState({ germs: 0, animals: 4, elapsedTime: 0 });
    const exactAnimals = aLevelState({ germs: 0, animals: 2, elapsedTime: 0 });
    // both should score the same: the surplus animals must not mint points
    expect(calcPoints(extraAnimals, level)).toBe(
      calcPoints(exactAnimals, level),
    );
  });

  it("scores a target-content level by goal completion, not germs", () => {
    const level = aLevel({
      startContent: ["🐶 🐱 🐭"],
      targetContent: ["🐶 🐭 🐱"],
      targetTimeSeconds: 1000,
      pointCoefficient: 150,
    });
    // before the goal is reached the level is worth nothing
    const unfinished = aLevelState({ animals: 3, goalReached: false });
    expect(calcPoints(unfinished, level)).toBe(0);
    // once matched (all animals kept, negligible time) it earns full points
    const finished = aLevelState({
      animals: 3,
      goalReached: true,
      elapsedTime: 0,
    });
    expect(calcPoints(finished, level)).toBe(150);
  });

  it("keeps legacy scoring stable", () => {
    // 1 germ, 2 animals start; all germs removed, all animals kept, no time
    const level = aLevel({
      startContent: ["🐶 🦠 🐱"],
      targetTimeSeconds: 60,
      pointCoefficient: 100,
    });
    const state = aLevelState({ germs: 0, animals: 2, elapsedTime: 0 });
    // germRatio = 1, animalRatio = 0, timeRatio = 0 => 100
    expect(calcPoints(state, level)).toBe(100);
  });
});

describe("isLevelGoalReached", () => {
  it("requires zero germs for a germ-goal level", () => {
    const level = aLevel({ startContent: ["🐶 🦠 🐱"] });
    expect(isLevelGoalReached(level, "🐶 🦠 🐱")).toBe(false);
    expect(isLevelGoalReached(level, "🐶  🐱")).toBe(true);
  });

  it("requires an exact text match for a target-content level", () => {
    const level = aLevel({
      startContent: ["🐶 🐱 🐭"],
      targetContent: ["🐶 🐭 🐱"],
    });
    expect(isLevelGoalReached(level, "🐶 🐱 🐭")).toBe(false);
    expect(isLevelGoalReached(level, "🐶 🐭 🐱")).toBe(true);
  });
});

describe("isLevelTimedOut", () => {
  afterEach(() => {
    globalThis.__typoTerminatorTestOverrides = undefined;
  });

  it("never times out a level without maxTimeSeconds", () => {
    const level = aLevel({ maxTimeSeconds: undefined });
    expect(isLevelTimedOut(level, 1_000_000)).toBe(false);
  });

  it("times out only at or beyond the limit", () => {
    const level = aLevel({ maxTimeSeconds: 90 });
    expect(isLevelTimedOut(level, 89_000)).toBe(false);
    expect(isLevelTimedOut(level, 90_000)).toBe(true);
    expect(isLevelTimedOut(level, 120_000)).toBe(true);
  });

  it("honors the test override when a limit is set", () => {
    globalThis.__typoTerminatorTestOverrides = { maxTimeSecondsOverride: 3 };
    const level = aLevel({ maxTimeSeconds: 90 });
    expect(isLevelTimedOut(level, 2_000)).toBe(false);
    expect(isLevelTimedOut(level, 3_000)).toBe(true);
  });

  it("ignores the test override for levels without a limit", () => {
    globalThis.__typoTerminatorTestOverrides = { maxTimeSecondsOverride: 3 };
    const level = aLevel({ maxTimeSeconds: undefined });
    expect(isLevelTimedOut(level, 1_000_000)).toBe(false);
  });
});
