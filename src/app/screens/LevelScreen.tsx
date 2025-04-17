import { isMac } from "../utils";
import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { useLevelEngine } from "../engines/level";
import { IGameEngineResult } from "../engines/game";
import { IGameHistory } from "../engines/gameHistory";
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
  const { gameMap, currentKeyCombination, cursorPos } = useLevelEngine({
    game,
    onKeyStroke: handleKeyStroke,
  });
  const level = game.currentLevel;
  return (
    <div
      className="flex flex-col gap-5 row-start-2 items-center sm:items-start"
      style={{
        opacity: game.levelFinished ? 0 : 1,
        transition: "opacity 1s ease",
      }}
    >
      <h1 className="text-2xl font-bold">{level.title}</h1>
      <p className="text-sm">{level.description}</p>
      <GameResultsBar game={game} alignRight={false} />
      <LevelResultsBar levelResults={game} />
      <GameMap gameMap={gameMap} cursorPos={cursorPos} />
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
  );
}

export default LevelScreen;

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
      Backspace: "remove left word",
      ArrowLeft: "move a word left",
      ArrowRight: "move a word right",
      Delete: "remove right word",
    },
    Backspace: "remove letter on left",
    ArrowLeft: "move a letter left",
    ArrowRight: "move a letter right",
    Delete: "remove letter on right",
  };

  let actualKeyCombination = keyCombination;
  if (isMac()) {
    actualKeyCombination = actualKeyCombination.map((key) =>
      key === "ctrl" ? "option" : key,
    );
    actualKeyCombination = actualKeyCombination.flatMap((key) =>
      key === "Delete" ? ["fn", "Backspace"] : key,
    );
  }
  return (
    <div className="flex flex-col items-center m-2 text-xs">
      <span
        className="inline-block p-2 rounded-lg text-black m-1"
        style={{
          backgroundImage: isPressed
            ? "radial-gradient(#00AA00, #006600)"
            : "radial-gradient(#6689A0, #607495)",
          transition: isPressed ? "none" : "background-color 1s ease",
        }}
      >
        {actualKeyCombination.map((k) => keyText[k]).join(" + ")}
      </span>
      <span className="text-xs">
        (
        {keyCombination.reduce(
          //@ts-expect-error "TODO: typescript typing of this reduce"
          (acc, curr) => acc[curr],
          keyCombinationExplanation,
        )}
        )
      </span>
    </div>
  );
}

function GameMap({
  gameMap,
  cursorPos,
}: {
  gameMap: string;
  cursorPos: number;
}) {
  const characters = Array.from(gameMap);

  // Define the keyframes for the blink animation
  const blinkAnimation = `
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `;

  return (
    <pre
      style={{
        minWidth: "450px",
        minHeight: "100px",
        backgroundImage: "radial-gradient(#6689A0, #364970)",
      }}
      className="font-mono whitespace-pre-wrap break-words relative text-white rounded-md m-2 p-3"
    >
      <style>{blinkAnimation}</style>
      {characters.map((char, index) => (
        <span key={index} className="relative">
          {index === cursorPos && (
            <span
              className="absolute inset-0 h-full w-0.5 bg-white"
              style={{ animation: "blink 0.7s linear infinite" }}
            />
          )}
          {char}
        </span>
      ))}
      {cursorPos === characters.length && (
        <span className="relative">
          <span
            className="absolute left-0 top-0 h-full w-0.5 bg-white"
            style={{ animation: "blink 0.7s linear infinite" }}
          />
        </span>
      )}
    </pre>
  );
}
