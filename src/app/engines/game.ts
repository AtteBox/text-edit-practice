import { useCallback, useEffect, useMemo, useState } from "react";
import { animalChars, germChars, ILevel } from "../levels";
import { z } from "zod";

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

/**
 * Internal state of the game engine for the whole game
 */
type IGameState = {
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

/**
 * Username validation schema
 */
const usernameSchema = z
  .string()
  .min(2, { message: "Username must be at least 2 characters long" })
  .max(100, { message: "Username must be at most 100 characters long" })
  .regex(
    /^(?=.*[a-zA-Z])[a-zA-Z0-9](?!.*  )[a-zA-Z0-9 ]*$/,
    "Username must consist of letters, digits and spaces. There must be at least one letter. Multiple consecutive spaces are not allowed.",
  );
const defaultUsernameError = "Invalid username";

/**
 * External api of the game engine for the whole game
 */
export type IGameEngineResult = {
  totalPoints: number;
  restartGame: () => void;
  currentLevelNumber: number;
  startNextLevel: () => void;
  gameHasStarted: boolean;
  levelFinished: boolean;
  isLastLevel: boolean;
  levelFailed: boolean;
  startGame: (username: string) => { error: string | undefined };
  updateLevelStats: ({ textContent }: { textContent: string }) => void;
  previousLevels: ILevelResult[];
} & ILevelResult;

export function useGameEngine({
  levels,
}: {
  levels: ILevel[];
}): IGameEngineResult {
  const [gameState, setGameState] = useState<IGameState>({
    currentLevel: 1,
    startTime: 0,
    elapsedTime: 0,
    previousLevels: [],
    gameHasStarted: false,
    levelFinished: false,
  });
  const level = levels[gameState.currentLevel - 1];

  const isLastLevel = gameState.currentLevel === levels.length;
  const levelFailed =
    !!gameState.levelFinished && calcPoints(gameState, level) <= 1;

  const updateGameState = useCallback((overrides: Partial<IGameState> = {}) => {
    setGameState((state) => ({
      ...state,
      elapsedTime: new Date().getTime() - state.startTime,
      ...overrides,
    }));
  }, []);

  const startNextLevel = useCallback(() => {
    setGameState((state) => ({
      ...state,
      levelFinished: false,
      germs: undefined,
      animals: undefined,
      startTime: Date.now(),
      elapsedTime: 0,
      currentLevel: state.currentLevel + 1,
      previousLevels: [
        ...state.previousLevels,
        {
          level: state.currentLevel,
          germs: state.germs,
          animals: state.animals,
          startTime: state.startTime,
          elapsedTime: state.elapsedTime,
          levelFinished: true,
        },
      ],
    }));
  }, []);

  const startGame = useCallback((username: string) => {
    const { error, data: validatedUsername } =
      usernameSchema.safeParse(username);
    if (error) {
      return {
        error:
          error.issues.length > 0
            ? error.issues[0].message
            : defaultUsernameError,
      };
    }

    setGameState((state) => ({
      ...state,
      gameHasStarted: true,
      username: validatedUsername,
      startTime: Date.now(),
      elapsedTime: 0,
    }));

    return { error: undefined };
  }, []);

  const restartGame = useCallback(() => {
    window.location.reload();
  }, []);

  const updateLevelStats = useCallback(
    ({ textContent }: { textContent: string }) => {
      const germs = getGermCount(textContent);
      const animals = getAnimalCount(textContent);
      updateGameState({ germs, animals });
    },
    [updateGameState],
  );

  const currentLevelPoints = useMemo(
    () => calcPoints(gameState, level),
    [gameState, level],
  );

  const totalPoints = useMemo(
    () => calcTotalPoints(gameState, level, levels),
    [gameState, level, levels],
  );

  const levelTotalGerms = useMemo(
    () => getGermCount(level.startContent.join("")),
    [level.startContent],
  );

  const levelTotalAnimals = useMemo(
    () => getAnimalCount(level.startContent.join("")),
    [level.startContent],
  );

  const previousLevels = useMemo(
    () =>
      gameState.previousLevels.map((levelState) => {
        const previousLevel = levels[levelState.level - 1];
        const previousLevelContent = previousLevel.startContent.join("");
        return {
          currentLevel: previousLevel,
          germs: levelState.germs ?? 0,
          levelTotalGerms: getGermCount(previousLevelContent),
          animals: levelState.animals ?? 0,
          levelTotalAnimals: getAnimalCount(previousLevelContent),
          elapsedTime: levelState.elapsedTime,
          targetTimeSeconds: previousLevel.targetTimeSeconds,
          pointCoefficient: previousLevel.pointCoefficient,
          currentLevelPoints: calcPoints(levelState, previousLevel),
        };
      }),
    [gameState.previousLevels, levels],
  );

  // when there are no germs left, show the level finished animation
  useEffect(() => {
    if (gameState.germs === 0) {
      updateGameState({ levelFinished: true });
    }
  }, [gameState.germs, updateGameState]);

  useEffect(() => {
    if (gameState.gameHasStarted && !gameState.levelFinished) {
      const interval = setInterval(() => {
        updateGameState();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [updateGameState, gameState.levelFinished, gameState.gameHasStarted]);

  return {
    isLastLevel,
    levelFailed,
    startNextLevel,
    startGame,
    restartGame,
    currentLevel: level,
    updateLevelStats,
    currentLevelPoints,
    totalPoints,
    currentLevelNumber: gameState.currentLevel,
    levelTotalGerms,
    levelTotalAnimals,
    germs: gameState.germs ?? levelTotalGerms,
    animals: gameState.animals ?? levelTotalAnimals,
    elapsedTime: gameState.elapsedTime,
    gameHasStarted: gameState.gameHasStarted,
    levelFinished: gameState.levelFinished,
    previousLevels,
  };
}

function calcPoints(gameState: ILevelState, level: ILevel) {
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

function calcTotalPoints(
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
