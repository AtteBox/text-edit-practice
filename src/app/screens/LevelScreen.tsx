import { assertNever, isMac } from "../utils";
import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { useLevelEngine } from "../engines/level";
import { IGameEngineResult } from "../engines/game";
import { ICursorStartPos } from "../levels";

function LevelScreen({ game }: { game: IGameEngineResult }) {
  const { gameMap, currentKeyCombination, cursorPos } = useLevelEngine({
    game,
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

export default LevelScreen;

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
      key === "ctrl" ? "option" : key,
    );
    actualKeyCombination = actualKeyCombination.flatMap((key) =>
      key === "Delete" ? ["fn", "Backspace"] : key,
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
      }}
      className="font-mono whitespace-pre-wrap break-words relative text-white bg-gray-800 rounded-md m-2 p-3"
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
