import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  calcPoints,
  calcTotalPoints,
  getAnimalCount,
  getGermCount,
  IGameState,
  ILevel,
  ILevelResult,
} from "../gameUtilities";

/**
 * Username validation schema
 */
const usernameSchema = z
  .string()
  .min(2, { message: "Username must be at least 2 characters." })
  .max(20, { message: "Username must be at most 20 characters." })
  .regex(
    /^(?=.*[a-zA-Z])[a-zA-Z0-9](?!.*  )[a-zA-Z0-9 ]*$/,
    "Must consist of letters, digits and spaces. At least one letter. Consecutive spaces are not allowed.",
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
  username?: string;
  isGameFinished: boolean;
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

  const isGameFinished = isLastLevel && gameState.levelFinished;

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
    username: gameState.username,
    isGameFinished,
  };
}
