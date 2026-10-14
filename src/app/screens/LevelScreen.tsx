import { isMac } from "../utils";
import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { useLevelEngine } from "../engines/level";
import { IGameEngineResult } from "../engines/game";
import { IGameHistory } from "../engines/gameHistory";
import { startContentToText } from "../gameUtilities";
import { useCallback } from "react";

function LevelScreen({
  game,
  gameHistory,
}: {
  game: IGameEngineResult;
  gameHistory: IGameHistory;
}) {
  const saveKeyStroke = gameHistory.saveKeyStroke;
  const handleKeyStroke = useCallback(
    (keyCombination: string[]) =>
      saveKeyStroke(game.currentLevelNumber, keyCombination),
    [game.currentLevelNumber, saveKeyStroke],
  );
  const { gameMap, currentKeyCombination, cursorPos, selection } =
    useLevelEngine({
      game,
      onKeyStroke: handleKeyStroke,
    });
  const level = game.currentLevel;

  return (
    <div className="relative w-full">
      {/* Pause Overlay */}
      {game.isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Game Paused</h2>
          <button
            onClick={game.resumeGame}
            className="p-3 rounded-md bg-green-600 hover:bg-green-700 active:bg-green-800 text-white focus:outline-none focus:ring focus:ring-green-300"
          >
            Resume Game
          </button>
        </div>
      )}

      {/* Main Level Content */}
      <div
        className="flex flex-col gap-5 row-start-2 items-center sm:items-start"
        style={{
          opacity: game.levelFinished ? 0 : 1,
          transition: "opacity 1s ease",
          filter: game.isPaused ? "blur(2px)" : "none",
        }}
      >
        <div className="flex justify-between w-full items-center">
          <h1 className="text-2xl font-bold">{level.title}</h1>
          <button
            onClick={game.pauseGame}
            disabled={game.isPaused}
            title="Pause Game"
            className="p-2 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 text-black focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50"
          >
            Pause
          </button>
        </div>
        <p className="text-sm">{level.description}</p>
        {level.maxTimeSeconds !== undefined && (
          <p className="text-sm font-semibold text-red-300">
            Time limit: {level.maxTimeSeconds}s (the level fails if you run out
            of time)
          </p>
        )}
        <GameResultsBar game={game} alignRight={false} />
        <LevelResultsBar levelResults={game} />
        <GameMap
          gameMap={gameMap}
          cursorPos={cursorPos}
          selection={selection}
          isPaused={game.isPaused}
        />
        {level.targetContent && (
          <div>
            <span className="text-sm">
              Target — make the text look like this:
            </span>
            <TargetMap text={startContentToText(level.targetContent)} />
          </div>
        )}
        <div>
          <span className="text-sm">Allowed key combinations:</span>
          <div className="flex flex-wrap grow-0 gap-1">
            {level.allowedKeyCombinations.map((keyCombination) => (
              <KeyCombinationTag
                key={keyCombination.join("-")}
                keyCombination={keyCombination}
                isPressed={currentKeyCombination === keyCombination}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelScreen;

type Explanation = string | { [key: string]: Explanation };

function KeyCombinationTag({
  keyCombination,
  isPressed,
}: {
  keyCombination: string[];
  isPressed: boolean;
}) {
  const keyText: Record<string, string> = {
    ctrl: "Control",
    shift: "Shift",
    Backspace: "Backspace",
    ArrowLeft: "Left Arrow",
    ArrowRight: "Right Arrow",
    Delete: "Delete",
    option: "Option",
    cmd: "Command",
    fn: "Fn",
    x: "X",
    c: "C",
    v: "V",
  };
  const keyCombinationExplanation: Record<string, Explanation> = {
    ctrl: {
      Backspace: "remove left word",
      ArrowLeft: "move a word left",
      ArrowRight: "move a word right",
      Delete: "remove right word",
      x: "cut selection",
      c: "copy selection",
      v: "paste",
      shift: {
        ArrowLeft: "select a word left",
        ArrowRight: "select a word right",
      },
    },
    shift: {
      ArrowLeft: "select a letter left",
      ArrowRight: "select a letter right",
    },
    Backspace: "remove letter on left",
    ArrowLeft: "move a letter left",
    ArrowRight: "move a letter right",
    Delete: "remove letter on right",
  };

  const baseKey = keyCombination[keyCombination.length - 1];
  const isClipboard =
    keyCombination.includes("ctrl") &&
    (baseKey === "x" || baseKey === "c" || baseKey === "v");

  let actualKeyCombination = keyCombination;
  if (isMac()) {
    actualKeyCombination = actualKeyCombination.map((key) =>
      key === "ctrl" ? (isClipboard ? "cmd" : "option") : key,
    );
    actualKeyCombination = actualKeyCombination.flatMap((key) =>
      key === "Delete" ? ["fn", "Backspace"] : key,
    );
  }

  const explanation = keyCombination.reduce<Explanation>(
    (acc, curr) => (typeof acc === "string" ? acc : acc[curr]),
    keyCombinationExplanation,
  );

  return (
    <div className="flex flex-col items-center m-2 text-xs">
      <span
        className="inline-block p-2 rounded-lg text-black m-1"
        style={{
          backgroundColor: isPressed ? "#00AA00" : "#8BADC5",
          transition: isPressed ? "none" : "background-color 0.7s ease",
        }}
      >
        {actualKeyCombination.map((k) => keyText[k] ?? k).join(" + ")}
      </span>
      <span className="text-xs">
        ({typeof explanation === "string" ? explanation : ""})
      </span>
    </div>
  );
}

function GameMap({
  gameMap,
  cursorPos,
  selection,
  isPaused,
}: {
  gameMap: string;
  cursorPos: number;
  selection: { start: number; end: number } | null;
  isPaused: boolean;
}) {
  const characters = Array.from(gameMap);

  // Define the keyframes for the blink animation
  const blinkAnimation = `
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `;

  const cursorAnimation = isPaused ? undefined : "blink 0.7s linear infinite";

  return (
    <pre
      style={{
        minWidth: "544px",
        minHeight: "120px",
        backgroundImage: "radial-gradient(#8BADC5, #6A8FAF)",
        fontFamily: "var(--font-noto-emoji), monospace",
        fontSize: "1.2rem",
      }}
      className="font-mono whitespace-pre-wrap break-words relative text-white rounded-md m-2 p-3"
    >
      <style>{blinkAnimation}</style>
      {characters.map((char, index) => {
        const isSelected =
          selection !== null &&
          index >= selection.start &&
          index < selection.end;
        return (
          <span
            key={index}
            className="relative"
            style={
              isSelected
                ? { backgroundColor: "rgba(255, 255, 255, 0.4)" }
                : undefined
            }
          >
            {index === cursorPos && (
              <span
                className="absolute inset-0 h-full w-0.5 bg-white"
                style={{ animation: cursorAnimation }}
              />
            )}
            {char}
          </span>
        );
      })}
      {cursorPos === characters.length && (
        <span className="relative">
          <span
            className="absolute left-0 top-0 h-full w-0.5 bg-white"
            style={{ animation: cursorAnimation }}
          />
        </span>
      )}
    </pre>
  );
}

function TargetMap({ text }: { text: string }) {
  return (
    <pre
      style={{
        minWidth: "544px",
        backgroundImage: "radial-gradient(#7CA05B, #5E8043)",
        fontFamily: "var(--font-noto-emoji), monospace",
        fontSize: "1.2rem",
      }}
      className="font-mono whitespace-pre-wrap break-words relative text-white rounded-md m-2 p-3"
    >
      {text}
    </pre>
  );
}
