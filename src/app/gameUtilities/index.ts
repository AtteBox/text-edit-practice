import { assertNever } from "../utils";

/**
 * Internal state of the game engine for the whole game
 */
export type IGameState = {
  username?: string;
  currentLevel: number;
  previousLevels: (ILevelState & { level: number })[];
  gameHasStarted: boolean;
  isPaused: boolean;
  gamePauses: { startTime: number; endTime?: number }[];
} & ILevelState;

/**
 * External state of the game engine for a single level
 */
export type ILevelResult = {
  currentLevel: ILevel;
  germs: number;
  levelTotalGerms: number;
  animals: number;
  levelTotalAnimals: number;
  elapsedTime: number;
  currentLevelPoints: number;
};

export type ILevel = {
  title: string;
  description: string;
  startContent: string[];
  /**
   * When set, the level is won by making the text match this content
   * instead of removing all germs.
   */
  targetContent?: string[];
  allowedKeyCombinations: string[][];
  cursorStartPos: ICursorStartPos;
  postLevelMessage: string;
  targetTimeSeconds: number;
  /**
   * When set, the level automatically fails after this many seconds.
   * Should be well above the time at which points drain to zero
   * (e.g. 3x targetTimeSeconds).
   */
  maxTimeSeconds?: number;
  pointCoefficient: number;
};

export const germChars = ["🦠", "🕷"];
export const animalChars = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐽",
  "🐸",
  "🐵",
  "🙈",
  "🙉",
  "🙊",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🐣",
  "🐥",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐚",
  "🐞",
  "🐜",
  "🦂",
  "🐢",
  "🐍",
  "🐊",
];

/**
 * Internal state of the game engine for a single level
 */
type ILevelState = {
  germs?: number;
  animals?: number;
  startTime: number;
  elapsedTime: number;
  levelFinished: boolean;
  goalReached?: boolean;
  timedOut?: boolean;
  isPaused: boolean;
  gamePauses: { startTime: number; endTime?: number }[];
};

export function calcPoints(gameState: ILevelState, level: ILevel) {
  const content = level.startContent.join("");
  const totalGerms = getGermCount(content);
  const totalAnimals = getAnimalCount(content);
  // Target-content levels are scored on whether the goal is reached (there are
  // no germs to count); germ levels are scored on how many germs remain.
  const goalRatio = level.targetContent
    ? gameState.goalReached
      ? 1
      : 0
    : totalGerms === 0
      ? 1
      : 1 - (gameState.germs ?? 0) / totalGerms;
  // clamped to 0 so that adding extra animals (e.g. by pasting) never adds points
  const animalRatio =
    totalAnimals === 0
      ? 0
      : Math.min(-(1 - (gameState.animals ?? 0) / totalAnimals), 0);

  const timeRatio = -Math.max(
    gameState.elapsedTime / 1000 / level.targetTimeSeconds,
    0,
  );
  return Math.max(
    Math.floor(
      (goalRatio + 2 * animalRatio + timeRatio) * level.pointCoefficient,
    ),
    0,
  );
}

export function calcTotalPoints(
  gameState: IGameState,
  currentLevel: ILevel,
  levels: ILevel[],
) {
  return (
    gameState.previousLevels.reduce(
      (acc, levelState) =>
        acc + calcPoints(levelState, levels[levelState.level - 1]),
      0,
    ) + calcPoints(gameState, currentLevel)
  );
}

export function getAnimalCount(text: string) {
  let count = 0;
  for (const char of text) {
    if (animalChars.includes(char)) {
      count++;
    }
  }
  return count;
}

export function getGermCount(text: string) {
  let count = 0;
  for (const char of text) {
    if (germChars.includes(char)) {
      count++;
    }
  }
  return count;
}

export type ICursorStartPos = "start" | "middle" | "end";

export function getActualInitialCursorPos(
  cursorStartPos: ICursorStartPos,
  levelStartContent: string[],
): number {
  const levelTextLength = Array.from(
    startContentToText(levelStartContent),
  ).length;
  switch (cursorStartPos) {
    case "start":
      return 0;
      break;
    case "middle":
      return Math.floor(levelTextLength / 2);
      break;
    case "end":
      return levelTextLength;
      break;
    default:
      assertNever(cursorStartPos);
  }
}

export function startContentToText(startContent: string[]) {
  return startContent.join("\n");
}

export function isLevelGoalReached(
  level: ILevel,
  textContent: string,
): boolean {
  if (level.targetContent) {
    return textContent === startContentToText(level.targetContent);
  }
  return getGermCount(textContent) === 0;
}

declare global {
  var __typoTerminatorTestOverrides:
    | { maxTimeSecondsOverride?: number }
    | undefined;
}

export function isLevelTimedOut(level: ILevel, elapsedTime: number): boolean {
  if (level.maxTimeSeconds === undefined) {
    return false;
  }
  const maxTimeSeconds =
    process.env.NODE_ENV !== "production"
      ? (globalThis.__typoTerminatorTestOverrides?.maxTimeSecondsOverride ??
        level.maxTimeSeconds)
      : level.maxTimeSeconds;
  return elapsedTime / 1000 >= maxTimeSeconds;
}
