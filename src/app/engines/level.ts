import { useCallback, useEffect, useState } from "react";
import { clipboardModifierPressed, ctrlEquivalentPressed, isMac } from "../utils";
import { calcTextarea, ITextareaState } from "../virtualTextarea";
import { IGameEngineResult } from "./game";
import {
  getActualInitialCursorPos,
  ILevel,
  startContentToText,
} from "../gameUtilities";

/**
 * Matches a physical keyboard event against a platform-neutral key
 * combination such as ["ctrl", "shift", "ArrowLeft"] or ["ctrl", "x"].
 *
 * Word/navigation ctrl combos map to Ctrl on Windows/Linux and Option on Mac.
 * Clipboard combos (ctrl + x/c/v) map to Ctrl on Windows/Linux and Cmd on Mac;
 * their letter is matched via e.code since Option/Cmd can alter e.key.
 */
function matchesKeyCombination(
  e: globalThis.KeyboardEvent,
  keyCombination: string[],
): boolean {
  const baseKey = keyCombination[keyCombination.length - 1];
  const modifiers = keyCombination.slice(0, -1);
  const wantCtrl = modifiers.includes("ctrl");
  const wantShift = modifiers.includes("shift");
  const isClipboard =
    wantCtrl && (baseKey === "x" || baseKey === "c" || baseKey === "v");

  if (e.shiftKey !== wantShift) {
    return false;
  }

  const ctrlModifierPressed = isClipboard
    ? clipboardModifierPressed(e)
    : ctrlEquivalentPressed(e);
  if (ctrlModifierPressed !== wantCtrl) {
    return false;
  }

  // Reject stray command modifiers this combo does not use, so that e.g.
  // Cmd+ArrowLeft on Mac doesn't trigger a Ctrl word move.
  if (isMac()) {
    if (e.ctrlKey) {
      return false;
    }
    if (isClipboard ? e.altKey : e.metaKey) {
      return false;
    }
  } else if (e.metaKey || e.altKey) {
    return false;
  }

  return isClipboard
    ? e.code === `Key${baseKey.toUpperCase()}`
    : e.key === baseKey;
}

function initialTextareaState(
  level: Pick<ILevel, "startContent" | "cursorStartPos">,
): ITextareaState {
  return {
    text: startContentToText(level.startContent),
    cursorPos: getActualInitialCursorPos(
      level.cursorStartPos,
      level.startContent,
    ),
    selectionAnchor: null,
    clipboard: "",
  };
}

export function useLevelEngine({
  game,
  onKeyStroke,
}: {
  game: IGameEngineResult;
  onKeyStroke: (keyCombination: string[]) => void;
}) {
  const level = game.currentLevel;
  const [textareaState, setTextareaState] = useState<ITextareaState>(() =>
    initialTextareaState(level),
  );
  const [currentKeyCombination, setCurrentKeyCombination] = useState<
    string[] | null
  >(null);

  //when level changes, reset the textarea state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTextareaState(
      initialTextareaState({
        startContent: level.startContent,
        cursorStartPos: level.cursorStartPos,
      }),
    );
  }, [level.cursorStartPos, level.startContent]);

  const updateLevelStats = game.updateLevelStats;

  const handleAllowedKeyCombination = useCallback(
    (keyCombination: string[]) => {
      setCurrentKeyCombination(keyCombination);

      const newTextareaState = calcTextarea(textareaState, keyCombination);
      setTextareaState(newTextareaState);

      updateLevelStats({ textContent: newTextareaState.text });
      onKeyStroke(keyCombination);
    },
    [textareaState, updateLevelStats, onKeyStroke],
  );

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      for (const keyCombination of level.allowedKeyCombinations) {
        if (matchesKeyCombination(e, keyCombination)) {
          // prevent the browser's native clipboard/selection actions
          e.preventDefault();
          handleAllowedKeyCombination(keyCombination);
          return;
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
    // Only listen for keys if the game has started, is not finished, and is not paused
    if (game.gameHasStarted && !game.levelFinished && !game.isPaused) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [
    game.gameHasStarted,
    game.levelFinished,
    game.isPaused,
    handleKeyDown,
    handleKeyUp,
  ]);

  const pauseGame = game.pauseGame;

  // Handle tab/window focus changes
  useEffect(() => {
    if (game.gameHasStarted && !game.levelFinished) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          pauseGame();
        }
      };

      const handleBlur = () => {
        pauseGame();
      };

      // Listen for visibility change events (tab switching)
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Listen for window focus/blur events
      window.addEventListener("blur", handleBlur);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        window.removeEventListener("blur", handleBlur);
      };
    }
  }, [game.gameHasStarted, game.levelFinished, pauseGame]);

  const selection =
    textareaState.selectionAnchor === null ||
    textareaState.selectionAnchor === textareaState.cursorPos
      ? null
      : {
          start: Math.min(textareaState.selectionAnchor, textareaState.cursorPos),
          end: Math.max(textareaState.selectionAnchor, textareaState.cursorPos),
        };

  return {
    gameMap: textareaState.text,
    currentKeyCombination,
    cursorPos: textareaState.cursorPos,
    selection,
  };
}
