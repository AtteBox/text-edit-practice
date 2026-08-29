import { levels } from "../levels";
import {
  getActualInitialCursorPos,
  isLevelGoalReached,
  startContentToText,
} from "../gameUtilities";
import { calcTextarea, ITextareaState } from "../virtualTextarea";

export type IKeyRecording = {
  level: number;
  pressedKeys: { keyCombination: string[]; timestamp: number }[];
}[];

export function validateKeyRecording(keyRecording: IKeyRecording): boolean {
  let previousKeyDownTimestamp = 0;
  for (let levelNo = 1; levelNo <= levels.length; levelNo++) {
    const level = levels[levelNo - 1];
    const levelRecording = keyRecording.find(
      (recording) => recording.level === levelNo,
    );
    if (!levelRecording) {
      return false;
    }

    const allowedKeyCombinations = new Set(
      level.allowedKeyCombinations.map((combination) => combination.join("+")),
    );

    let textareaState: ITextareaState = {
      text: startContentToText(level.startContent),
      cursorPos: getActualInitialCursorPos(
        level.cursorStartPos,
        level.startContent,
      ),
      selectionAnchor: null,
      clipboard: "",
    };
    for (const pressedKey of levelRecording.pressedKeys) {
      if (pressedKey.timestamp < previousKeyDownTimestamp) {
        return false;
      }
      previousKeyDownTimestamp = pressedKey.timestamp;

      if (!allowedKeyCombinations.has(pressedKey.keyCombination.join("+"))) {
        return false;
      }

      textareaState = calcTextarea(textareaState, pressedKey.keyCombination);
    }

    if (!isLevelGoalReached(level, textareaState.text)) {
      return false;
    }
  }
  return true;
}
