"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import startBanner from "../start-banner.png";

function isMac() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

function ctrlEquivalentPressed(event: KeyboardEvent) {
  return isMac() ? event.altKey : event.ctrlKey;
}

const germChars = ["🦠", "🕷"];
const animalChars = [
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

function getAnimalCount(text: string) {
  let count = 0;
  for (const char of text) {
    if (animalChars.includes(char)) {
      count++;
    }
  }
  return count;
}

function getGermCount(text: string) {
  let count = 0;
  for (const char of text) {
    if (germChars.includes(char)) {
      count++;
    }
  }
  return count;
}

/**
 * Get a color for a ratio where 0 is bad and 1 is good
 * @param ratio number between 0-1
 * @returns css color string
 */
function getDangerColor(ratio: number): string {
  const red = 255 * Math.min(1, 2 * ratio);
  const green = 255 * Math.min(1, 2 - 2 * ratio);
  return `rgb(${red}, ${green}, 0)`;
}

function calcPoints(gameState: ILevelState, level: ILevel) {
  const content = level.startContent.join("");
  const germRatio = 1 - (gameState.germs ?? 0) / getGermCount(content);
  const animalRatio = -(1 - (gameState.animals ?? 0) / getAnimalCount(content));
  const timeRatio = -Math.max(
    gameState.elapsedTime / 1000 / level.targetTimeSeconds,
    0
  );
  return Math.max(
    Math.floor(
      (germRatio + 2 * animalRatio + timeRatio) * level.pointCoefficient
    ),
    0
  );
}

function calcTotalPoints(gameState: IGameState, currentLevel: ILevel) {
  return (
    gameState.previousLevels.reduce(
      (acc, levelState) =>
        acc + calcPoints(levelState, levels[levelState.level - 1]),
      0
    ) + calcPoints(gameState, currentLevel)
  );
}

type ICursorStartPos = "start" | "middle" | "end";

type ILevel = {
  title: string;
  description: string;
  startContent: string[];
  allowedKeyCombinations: string[][];
  cursorStartPos: ICursorStartPos;
  postLevelMessage: string;
  targetTimeSeconds: number;
  pointCoefficient: number;
};

const levels: ILevel[] = [
  {
    title: "Level 1: Control Backspace And Arrow Keys",
    description:
      "Remove the germs and spiders from the text area using control + backspace and control + left and right arrow keys.",
    startContent: [
      "🐶🐱 🦠🦠🕷🦠 🐭🐹 🦠🦠🦠 🐰🦊 🕷🕷🕷 🐻🐼",
      "🦠🦠🕷🕷 🐨🐯 🦠🦠🕷 🦁🐮 🕷🕷🕷 🐷🐽",
      "🦠🕷🦠🕷 🐸🐵 🕷🕷🕷 🦠🦠🦠 🙈🙉 🕷🦠🕷",
      "🙊🐔 🦠🦠🦠🕷 🐧🐦 🕷🕷🕷 🐤🐣 🦠🦠🕷",
      "🐥🦆 🦠🕷🦠 🦅🦉 🕷🕷 🦇🐺 🦠🦠🦠 🐗🐴",
      "🕷🕷🕷 🦄🐝 🦠🦠🕷 🐛🦋 🕷🕷🕷 🐌🐚",
      "🦠🕷🕷🕷 🐞🐜 🦠🦠🦠 🦂🐢 🕷🕷 🐍🐊",
    ],
    // make the start content more interesting should be approximately 20 lines:
    allowedKeyCombinations: [
      ["ctrl", "Backspace"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Congratulations for passing level 1! You should also learn to sometimes release the control key before pressing the next combination and that's what we will practice in the next level.",
    targetTimeSeconds: 60,
    pointCoefficient: 100,
  },
  {
    title: "Level 2: Mixing Control and Normal Keys for Efficiency",
    description:
      "Remove the germs and spiders from the text using both control key combinations and normal keys. Use control combinations to delete entire germ words and normal keys to edit within mixed words.",
    startContent: [
      "🦠🦠🕷🕷 🐶🐱🦠🐭 🦠🦠🦠🕷 🐹🐰🐰",
      "🕷🕷🕷🕷 🐻🐼🐶 🦠🐨🐯🦠 🦁🐮🐱",
      "🦠🦠🦠🕷 🐷🐽🐰 🕷🐸🐵🦠 🐶🦠🐱",
      "🐭🐹🕷🐰 🐰🕷🐶🐱 🕷🦠🕷🕷 🐻🐼🐶",
      "🦠🦠🦠🦠 🐨🐯🐷 🦠🐮🐽🦠 🐸🐵🐶",
      "🐶🐱🦠🐭 🦠🕷🐹🐰 🕷🕷🕷🕷 🐻🐼🐶",
      "🦠🦠🕷🦠 🐨🐯🕷🐷 🕷🕷🐮🐽 🦠🐸🐵",
      "🐶🦠🐱🐭 🦠🦠🦠🕷 🐹🦠🐰🐰 🕷🕷🕷🕷",
      "🦠🦠🦠🦠 🐻🐼🐶 🕷🕷🕷🕷 🐨🐯🐷",
      "🦠🐮🕷🐽 🐸🐵🦠🦠 🐶🐱🕷🐭 🕷🕷🕷🕷",
      "🐹🐰🦠🐰 🦠🕷🕷🕷 🐻🐼🕷🐶 🦠🦠🦠🦠",
    ],
    allowedKeyCombinations: [
      // Control key combinations
      ["ctrl", "Backspace"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      // Normal keys
      ["Backspace"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Great job! You've learned to use both control and normal keys effectively. In the next level, we will introduce the delete key to help editing from left to right.",
    targetTimeSeconds: 90,
    pointCoefficient: 150,
  },
  {
    title: "Level 3: Control Delete, and Arrow Keys",
    description:
      "Remove the germs and spiders from the text area using control + backspace, delete, and control + left and right arrow keys.",
    startContent: [
      "🐶🐱 🦠🦠🦠🦠 🐭🐹 🕷🕷🕷🕷 🐰🦊 🦠🦠🦠🦠 🐻🐼",
      "🕷🕷🕷🕷 🐨🐯 🦠🦠🦠🦠 🦁🐮 🕷🕷🕷🕷 🐷🐽",
      "🦠🦠🦠🦠 🐸🐵 🕷🕷🕷🕷 🦠🦠🦠🦠 🙈🙉 🦠🦠🦠🦠",
      "🕷🕷🕷🕷 🙊🐔 🦠🦠🦠🦠 🐧🐦 🕷🕷🕷🕷 🐤🐣",
      "🦠🦠🦠🦠 🐥🦆 🕷🕷🕷🕷 🦅🦉 🦠🦠🦠🦠 🦇🐺",
      "🕷🕷🕷🕷 🐗🐴 🦠🦠🦠🦠 🦄🐝 🕷🕷🕷🕷 🐛🦋",
      "🦠🦠🦠🦠 🐌🐚 🕷🕷🕷🕷 🐞🐜 🦠🦠🦠🦠 🦂🐢",
      "🕷🕷🕷🕷 🐍🐊 🦠🦠🦠🦠 🐋🐳 🕷🕷🕷🕷 🐬🐟",
      "🦠🦠🦠🦠 🐠🐡 🕷🕷🕷🕷 🦈🐙 🦠🦠🦠🦠 🐚🐌",
      "🕷🕷🕷🕷 🐞🐜 🦠🦠🦠🦠 🦋🐛 🕷🕷🕷🕷 🐝🐞",
      "🦠🦠🦠🦠 🐜🐝 🕷🕷🕷🕷 🦋🐛 🦠🦠🦠🦠 🐔🐧",
    ],
    allowedKeyCombinations: [
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["ctrl", "Delete"],
    ],
    cursorStartPos: "start",
    postLevelMessage:
      "Excellent! You've mastered using the delete key together with control for efficient text editing. In the next level, we will introduce the delete key without control to help editing within words also.",
    targetTimeSeconds: 70,
    pointCoefficient: 150,
  },
  {
    title:
      "Level 4: Combining Control Delete And Just Delete for Word and Character Editing",
    description:
      "Remove the germs and spiders from the text area using the delete key, solely and together with control, to delete letters and entire germ words.",
    startContent: [
      "🦠🦠🕷🕷 🐶🐱🦠🐭 🦠🦠🦠🕷 🐹🐰🐰",
      "🕷🕷🕷🕷 🐻🐼🐶 🦠🐨🐯🦠 🦁🐮🐱",
      "🦠🦠🦠🕷 🐷🐽🐰 🕷🐸🐵🦠 🐶🦠🐱",
      "🐭🐹🕷🐰 🐰🕷🐶🐱 🕷🦠🕷🕷 🐻🐼🐶",
      "🦠🦠🦠🦠 🐨🐯🐷 🦠🐮🐽🦠 🐸🐵🐶",
      "🐶🐱🦠🐭 🦠🕷🐹🐰 🕷🕷🕷🕷 🐻🐼🐶",
      "🦠🦠🕷🦠 🐨🐯🕷🐷 🕷🕷🐮🐽 🦠🐸🐵",
      "🐶🦠🐱🐭 🦠🦠🦠🕷 🐹🦠🐰🐰 🕷🕷🕷🕷",
      "🦠🦠🦠🦠 🐻🐼🐶 🕷🕷🕷🕷 🐨🐯🐷",
      "🦠🐮🕷🐽 🐸🐵🦠🦠 🐶🐱🕷🐭 🕷🕷🕷🕷",
      "🐹🐰🦠🐰 🦠🕷🕷🕷 🐻🐼🕷🐶 🦠🦠🦠🦠",
    ],
    allowedKeyCombinations: [
      ["ctrl", "Delete"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["Delete"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "start",
    postLevelMessage:
      "Fantastic! You've effectively master the delete key now. Next we will use all the keys you've learned so far.",
    targetTimeSeconds: 120,
    pointCoefficient: 200,
  },
  {
    title: "Level 5: Mastering All Editing Techniques",
    description:
      "This is the ultimate test! Remove all the germs and spiders from the text using all the key combinations you've learned so far. Use control key combinations for efficient word navigation and deletion, and use normal keys for precise character editing.",
    startContent: [
      "🐶🕷🐱🦠🐭 🕷🕷🕷🦠 🕷🕷🕷🦠🕷 🦊🕷🐻🦠🐼",
      "🕷🐨🕷🐯🦠 🕷🕷🕷🦠🕷 🕷🐽🕷🐸🦠🕷",
      "🕷🙈🦠🕷🙉 🕷🕷🕷🕷🕷🐭 🦠🦠🕷🐰🕷",
      "🦊🕷🐻🦠🕷🐼 🐱🐱 🕷🦠🕷🦠🕷 🦁🕷🐮🦠",
      "🕷🦠🕷🦠🦠 🐸🕷🦠🐵🕷 🦠🕷🦠🕷🦠",
      "🦠🐱🕷🐭🕷 🦠🦠🕷🦠🕷🐰 🕷🦠🕷🦠🕷",
      "🦠🐼🕷🐨🕷 🐯🕷🦁🕷🐮 🕷🦠🐷🕷🐽",
      "🕷🦠🕷🦠🦠🕷 🕷🦠🕷🦠🦠 🕷🦠🕷🦠",
      "🦠🐭🕷🐹🦠 🕷🦠 🐼🐼🐼 🕷🦠🕷 🦠🕷🐻🕷🦠",
      "🕷🦠🕷🦠🕷 🦠🕷🦁🕷🦠 🕷🦠🕷🦠🕷",
      "🦠🕷🦠🦠🕷🦠 🕷🦠🕷🦠🕷 🐶🦠🕷🐱",
      "🕷🐭🕷 🐹🐹 🕷🦠 🕷🦠🕷🦠🕷 🦊🕷🐻🕷",
      "🦠🕷🦠🕷🦠 🕷🦠🕷🦠🕷 🕷🐮🦠🕷🦠",
      "🕷🐽🕷🐸🕷🦠 🕷🦠🕷🦠🕷 🕷🐶🕷🐱",
      "🦠🕷🐭🕷🦠 🕷🦠🦠🕷🦠 🕷🦊🕷🐻🕷",
      "🦠🕷🐼🕷🦠 🕷🦠🕷🦠🕷 🕷🐮🕷🦠🕷",
      "🦠🕷🦠🕷🦠 🕷🦠🕷🦠🕷 🕷🦠🕷🦠🕷",
      "🕷🐶🕷🐱🕷 🦠🦠🕷🦠🕷 🕷🦠🕷🦠🕷",
      "🕷🦊🕷🐻🕷🦠 🕷🐼🕷🦠🕷 🕷🐯🕷🦁",
      "🕷🦠🕷🐮🕷 🕷🐷🕷🐽🕷 🕷🐸🕷🦠🕷",
    ],
    allowedKeyCombinations: [
      // Control key combinations
      ["ctrl", "Backspace"],
      ["ctrl", "Delete"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      // Normal keys
      ["Backspace"],
      ["Delete"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "middle",
    postLevelMessage:
      "Outstanding! You've mastered all the editing techniques. You're now a text editing expert!",
    targetTimeSeconds: 180,
    pointCoefficient: 250,
  },
];

type ILevelState = {
  germs?: number;
  animals?: number;
  startTime: number;
  elapsedTime: number;
  levelFinished?: boolean;
};

type IGameState = {
  currentLevel: number;
  previousLevels: (ILevelState & { level: number })[];
  gameHasStarted: boolean;
} & ILevelState;

export default function Home() {
  const [gameState, setGameState] = useState<IGameState>({
    currentLevel: 1,
    startTime: 0,
    elapsedTime: 0,
    previousLevels: [],
    gameHasStarted: false,
  });
  const level = levels[gameState.currentLevel - 1];

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
    []
  );

  const restartGame = useCallback(() => {
    window.location.reload();
  }, []);

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-5 row-start-2 items-center sm:items-start">
        {!gameState.gameHasStarted && <StartScreen startGame={startGame} />}
        {gameState.gameHasStarted && !showLevelFinished && (
          <LevelScreen
            level={level}
            gameState={gameState}
            updateLevelStats={updateGameState}
          />
        )}
        {showLevelFinished && !isLastLevel && !levelFailed && (
          <FinishedLevelScreen
            gameState={gameState}
            level={level}
            startNextLevel={startNextLevel}
          />
        )}
        {showLevelFinished && levelFailed && (
          <FailedLevelScreen
            gameState={gameState}
            level={level}
            restartGame={restartGame}
          />
        )}
        {showLevelFinished && isLastLevel && (
          <EndScreen
            gameState={gameState}
            levels={levels}
            restartGame={restartGame}
          />
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span className="text-xs">
          © Atte Virtanen {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

function getCursorText(cursorStartPos: ICursorStartPos): string {
  switch (cursorStartPos) {
    case "start":
      return "at the beginning";
    case "middle":
      return "in the middle";
    case "end":
      return "at the end";
    default:
      assertNever(cursorStartPos);
  }
}

function assertNever(cursorStartPos: never): never {
  throw new Error(`Unexpected cursor position: ${cursorStartPos}`);
}

function FinishedLevelScreen({
  gameState,
  level,
  startNextLevel,
}: {
  gameState: IGameState;
  level: ILevel;
  startNextLevel: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md"
      style={{
        opacity: gameState.levelFinished ? 1 : 0,
        transition: "opacity 2s ease",
      }}
    >
      <h1 className="text-2xl font-bold">Level {gameState.currentLevel} Completed!
      </h1>
      <LevelResultsBar gameState={gameState} level={level} />
      <GameResultsBar gameState={gameState} level={level} alignRight={false} />
      <p className="text-sm">{level.postLevelMessage}
      </p>
      <div className="flex flex-col gap-4 items-end self-stretch">
          <button
            onClick={startNextLevel}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Next Level
          </button>
      </div>
    </div>
  );
}

function FailedLevelScreen({
  gameState,
  level,
  restartGame,
}: {
  gameState: IGameState;
  level: ILevel;
  restartGame: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md"
      style={{
        opacity: gameState.levelFinished ? 1 : 0,
        transition: "opacity 2s ease",
      }}
    >
      <h1 className="text-2xl font-bold">
        Level {gameState.currentLevel} Failed!
      </h1>
      <LevelResultsBar gameState={gameState} level={level} />
      <GameResultsBar gameState={gameState} level={level} alignRight={false} />
      <p className="text-sm">
        You need to get at least one point to finish each level. Please start the game again!
      </p>
      <div className="flex flex-col gap-4 items-end self-stretch">
          <button
            onClick={restartGame}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Restart Game
          </button>
      </div>
    </div>
  );
}

function LevelScreen({
  level,
  gameState,
  updateLevelStats,
}: {
  level: ILevel;
  gameState: IGameState;
  updateLevelStats: ({
    germs,
    animals,
  }: {
    germs: number;
    animals: number;
  }) => void;
}) {
  const [currentKeyCombination, setCurrentKeyCombination] = useState<
    string[] | null
  >(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const keysByLevel = useRef<Record<string, string[]>>({});

  // focus the text area when the level changes
  useEffect(() => {
    if (!textAreaRef.current || !gameState.gameHasStarted) {
      return;
    }
    textAreaRef.current.focus();
    switch (level.cursorStartPos) {
      case "start":
        textAreaRef.current.selectionStart = 0;
        break;
      case "middle":
        textAreaRef.current.selectionStart = Math.floor(
          textAreaRef.current.value.length / 2
        );
        break;
      case "end":
        textAreaRef.current.selectionStart = textAreaRef.current.value.length;
        break;
      default:
        assertNever(level.cursorStartPos);
    }
  }, [gameState.gameHasStarted, level.cursorStartPos]);

  const handleAllowedKeyCombination = (keyCombination: string[]) => {
    setCurrentKeyCombination(keyCombination);

    keysByLevel.current[gameState.currentLevel] = [
      ...(keysByLevel.current[gameState.currentLevel] ?? []),
      keyCombination.reduce((acc, key) => acc + "+" + key),
    ];

    // propagate the event to the base event handler, and then update the game state
    setTimeout(() => {
      if (!textAreaRef.current) {
        console.warn("Cannot updateLevelStats: Text area not found");
        return;
      }
      const germs = getGermCount(textAreaRef.current.value);
      const animals = getAnimalCount(textAreaRef.current.value);
      updateLevelStats({ germs, animals });
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(e.key, e.ctrlKey, e.metaKey, e.altKey, e.shiftKey);
    const pressedModifierCount = [
      e.ctrlKey,
      e.metaKey,
      e.altKey,
      e.shiftKey,
    ].filter((pressed) => pressed).length;
    for (const keyCombination of level.allowedKeyCombinations) {
      if (
        pressedModifierCount === 0 &&
        keyCombination.length === 1 &&
        e.key === keyCombination[0]
      ) {
        handleAllowedKeyCombination(keyCombination);
        return;
      }
      if (pressedModifierCount === 1 && keyCombination.length === 2) {
        const [ctrlKey, keyName] = keyCombination;
        if (
          ctrlKey === "ctrl" &&
          ctrlEquivalentPressed(e) &&
          e.key === keyName
        ) {
          handleAllowedKeyCombination(keyCombination);
          return;
        }
      }
    }
    // prevent disallowed key combinations
    e.preventDefault();
  };

  return (
    <div
      className="flex flex-col gap-5 row-start-2 items-center sm:items-start"
      style={{
        opacity: gameState.levelFinished ? 0 : 1,
        transition: "opacity 1s ease",
      }}
    >
      <h1 className="text-2xl font-bold">{level.title}</h1>
      <p className="text-sm">{level.description}</p>
      <GameResultsBar gameState={gameState} level={level} alignRight={false} />
      <LevelResultsBar gameState={gameState} level={level} />
      <textarea
        ref={textAreaRef}
        cols={level.startContent[0].length + 1}
        rows={level.startContent.length + 1}
        defaultValue={level.startContent.join("\r\n")}
        className="p-2 rounded-lg resize-none text-black font-extrabold"
        onKeyDown={handleKeyDown}
        onKeyUp={() => setCurrentKeyCombination(null)}
      ></textarea>
      <div>
        <span className="text-sm">Allowed key combinations:</span>
        <div className="flex flex-wrap gap-2">
          {level.allowedKeyCombinations.map((keyCombination) => (
            <KeyCombinationTag
              key={keyCombination.join("-")}
              keyCombination={keyCombination}
              isPressed={currentKeyCombination === keyCombination}
            />
          ))}
        </div>
      </div>
      <p className="text-sm">
        Note: The cursor is {getCursorText(level.cursorStartPos)}.
      </p>
    </div>
  );
}

function StartScreen({ startGame }: { startGame: () => void }) {
  return (
    <div className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md">
      <h1 className="text-2xl font-bold">Welcome to Typo Terminator!</h1>
      <p className="text-sm">
        A game where you eliminate unwanted characters swiftly!
      </p>
      <Image src={startBanner} alt="Typo Terminator Banner" />
      <div className="flex flex-col gap-4 items-end self-stretch">
        <button
          onClick={startGame}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

function EndScreen({
  gameState,
  levels,
  restartGame,
}: {
  gameState: IGameState;
  levels: ILevel[];
  restartGame: () => void;
}) {
  const lastLevel = levels[levels.length - 1];
  const allLevelGameStates = [...gameState.previousLevels, gameState];
  return (
    <div className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md">
      <h1 className="text-2xl font-bold">Congratulations!</h1>
      <p className="text-sm">You&apos;ve completed all the levels!</p>
      <ol className="list-decimal">
        {allLevelGameStates.map((gameState, index) => (
          <li key={index}>
            <LevelResultsBar gameState={gameState} level={levels[index]} />
          </li>
        ))}
      </ol>
      <GameResultsBar gameState={gameState} level={lastLevel} alignRight />
      <div className="flex flex-col gap-4 items-end self-stretch">
        <button
          onClick={restartGame}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

function GameResultsBar({
  gameState,
  level,
  alignRight,
}: {
  gameState: IGameState;
  level: ILevel;
  alignRight?: boolean;
}) {
  return (
    <span className={"text-xs" + alignRight ? " self-end" : " self-start"}>
      Total Points: {calcTotalPoints(gameState, level)}
    </span>
  );
}

function LevelResultsBar({
  gameState,
  level,
}: {
  gameState: ILevelState;
  level: ILevel;
}) {
  const totalGerms = getGermCount(level.startContent.join(""));
  const totalAnimals = getAnimalCount(level.startContent.join(""));
  const points = calcPoints(gameState, level);
  return (
    <div className="flex gap-4">
      <p
        className="text-sm"
        style={{
          color: getDangerColor((gameState.germs ?? 0) / totalGerms),
        }}
      >
        Germs: {gameState.germs}/{totalGerms}
      </p>
      <p className="text-sm">+</p>
      <p
        className="text-sm"
        style={{
          color: getDangerColor(1 - (gameState.animals ?? 0) / totalAnimals),
        }}
      >
        Animals: {gameState.animals}/{totalAnimals}
      </p>
      <p className="text-sm">+</p>
      <p
        className="text-sm"
        style={{
          color: getDangerColor(
            gameState.elapsedTime / 1000 / level.targetTimeSeconds
          ),
        }}
      >
        Time: {Math.floor(gameState.elapsedTime / 1000)}/
        {level.targetTimeSeconds}s
      </p>
      <p className="text-sm">*</p>{" "}
      <p
        className="text-sm"
        style={{
          color: getDangerColor((level.pointCoefficient - 100) / 150),
        }}
      >
        Difficulty: {level.pointCoefficient}
      </p>
      <p className="text-sm">=</p>
      <p
        className="text-sm"
        style={{
          color: getDangerColor(Math.max(200 - points, 0) / 200),
        }}
      >
        Points: {points}
      </p>
    </div>
  );
}

function KeyCombinationTag({
  keyCombination,
  isPressed,
}: {
  keyCombination: string[];
  isPressed: boolean;
}) {
  const keyText: Record<string, string> = {
    ctrl: "Control",
    Backspace: "Backspace",
    ArrowLeft: "Left Arrow",
    ArrowRight: "Right Arrow",
    Delete: "Delete",
    option: "Option",
    fn: "Fn",
  };
  const keyCombinationExplanation: Record<
    string,
    string | Record<string, string>
  > = {
    ctrl: {
      Backspace: "Remove word to the left",
      ArrowLeft: "Move cursor to the left word",
      ArrowRight: "Move cursor to the right word",
      Delete: "Delete word to the right",
    },
    Backspace: "Delete character to the left",
    ArrowLeft: "Move to the character on the left",
    ArrowRight: "Move to the character on the right",
    Delete: "Delete character to the right",
  };

  let actualKeyCombination = keyCombination;
  if (isMac()) {
    actualKeyCombination = actualKeyCombination.map((key) =>
      key === "ctrl" ? "option" : key
    );
    actualKeyCombination = actualKeyCombination.flatMap((key) =>
      key === "Delete" ? ["fn", "Backspace"] : key
    );
  }
  return (
    <div className="inline-block m-2">
      <span
        className="inline-block p-2 bg-gray-100 rounded-lg text-black m-1"
        style={{
          backgroundColor: isPressed ? "green" : "white",
          transition: isPressed ? "none" : "background-color 1s ease",
        }}
      >
        {actualKeyCombination.map((k) => keyText[k]).join(" + ")}
      </span>
      <br />
      <span className="text-xs">
        (
        {keyCombination.reduce(
          //@ts-expect-error "TODO: typescript typing of this reduce"
          (acc, curr) => acc[curr],
          keyCombinationExplanation
        )}
        )
      </span>
    </div>
  );
}
