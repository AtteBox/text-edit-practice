import { useCallback, useEffect, useState } from "react";
import { assertNever, ctrlEquivalentPressed } from "../utils";
import { calcTextarea } from "../virtualTextarea";
import { IGameEngineResult } from "./game";
import { ICursorStartPos } from "../levels";

export function useLevelEngine({ game }: { game: IGameEngineResult }) {
  const level = game.currentLevel;
  const [gameMap, setGameMap] = useState<string>(
    startContentToText(level.startContent),
  );
  const [currentKeyCombination, setCurrentKeyCombination] = useState<
    string[] | null
  >(null);
  const [cursorPos, setCursorPos] = useState<number>(0);

  //when level changes, reset the game map
  useEffect(() => {
    setGameMap(startContentToText(level.startContent));
  }, [level.startContent, setGameMap]);

  // when level changes, reset the cursor position
  useEffect(() => {
    setCursorPos(
      getActualInitialCursorPos(level.cursorStartPos, level.startContent),
    );
  }, [level.cursorStartPos, level.startContent]);

  const updateLevelStats = game.updateLevelStats;

  const handleAllowedKeyCombination = useCallback(
    (keyCombination: string[]) => {
      setCurrentKeyCombination(keyCombination);

      const { cursorPos: newCursorPos, text: newGameMap } = calcTextarea(
        cursorPos,
        gameMap,
        keyCombination,
      );
      setGameMap(newGameMap);
      setCursorPos(newCursorPos);

      updateLevelStats({ textContent: newGameMap });
    },
    [gameMap, cursorPos, updateLevelStats],
  );

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
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
    },
    [handleAllowedKeyCombination, level.allowedKeyCombinations],
  );

  const handleKeyUp = useCallback(() => {
    setCurrentKeyCombination(null);
  }, []);

  useEffect(() => {
    if (game.gameHasStarted && !game.levelFinished) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [game.gameHasStarted, game.levelFinished, handleKeyDown, handleKeyUp]);

  return { gameMap, currentKeyCombination, cursorPos };
}

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
