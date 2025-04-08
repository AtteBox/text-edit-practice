import { levels } from "../levels";
import { getGermCount } from "../utilities/game";
import { getActualInitialCursorPos, startContentToText } from "../utilities/level";
import { calcTextarea } from "../virtualTextarea";

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

    let text = startContentToText(level.startContent);
    let cursorPos: number = getActualInitialCursorPos(
      level.cursorStartPos,
      level.startContent,
    );
    for (const pressedKey of levelRecording.pressedKeys) {
      if (pressedKey.timestamp < previousKeyDownTimestamp) {
        return false;
      }
      previousKeyDownTimestamp = pressedKey.timestamp;

      const result = calcTextarea(cursorPos, text, pressedKey.keyCombination);
      cursorPos = result.cursorPos;
      text = result.text;
    }

    if (getGermCount(text) > 0) {
      return false;
    }
  }
  return true;
}
