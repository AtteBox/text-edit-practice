import { assertNever } from "../utils";

/**
 * Internal state of the game engine for the whole game
 */
export type IGameState = {
  username?: string;
  currentLevel: number;
  previousLevels: (ILevelState & { level: number })[];
  gameHasStarted: boolean;
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
  allowedKeyCombinations: string[][];
  cursorStartPos: ICursorStartPos;
  postLevelMessage: string;
  targetTimeSeconds: number;
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
};

export function calcPoints(gameState: ILevelState, level: ILevel) {
  const content = level.startContent.join("");
  const germRatio = 1 - (gameState.germs ?? 0) / getGermCount(content);
  const animalRatio = -(1 - (gameState.animals ?? 0) / getAnimalCount(content));
  const timeRatio = -Math.max(
    gameState.elapsedTime / 1000 / level.targetTimeSeconds,
    0,
  );
  return Math.max(
    Math.floor(
      (germRatio + 2 * animalRatio + timeRatio) * level.pointCoefficient,
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
