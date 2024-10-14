import { useCallback, useEffect, useMemo, useState } from "react";
import { animalChars, germChars, ILevel } from "../levels";

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
 * External api of the game engine for the whole game
 */
export type IGameEngineResult = {
  totalPoints: number;
  restartGame: () => void;
  currentLevelNumber: number;
  startNextLevel: () => void;
  gameHasStarted: boolean;
  levelFinished: boolean;
  showLevelFinished: boolean; // TODO: remove animation stuff from here
  isLastLevel: boolean;
  levelFailed: boolean;
  startGame: () => void;
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

  // TODO: this animation related stuff should not be here (showLevelFinished)
  const [showLevelFinished, setShowLevelFinished] = useState(false);
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
    setShowLevelFinished(false);
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

  const startGame = useCallback(
    () =>
      setGameState((state) => ({
        ...state,
        gameHasStarted: true,
        startTime: Date.now(),
        elapsedTime: 0,
      })),
    [],
  );

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

  useEffect(() => {
    if (gameState.levelFinished) {
      setTimeout(() => {
        setShowLevelFinished(true);
      }, 1000);
    }
  }, [gameState.levelFinished]);
  return {
    showLevelFinished,
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
