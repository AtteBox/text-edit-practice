import { useState } from "react";
import { IKeyRecording } from "../gameValidation";

export function useGameHistory(): IGameHistory {
  const [keyRecording, setKeyRecording] = useState<IKeyRecording>([]);

  const saveKeyStroke = (level: number, keyCombination: string[]) => {
    if (keyRecording.length < level - 1) {
      throw new Error("Invalid level number");
    }
    const timestamp = Date.now();
    setKeyRecording((prevHistory) => {
      const updatedHistory = [...prevHistory];
      const levelIndex = updatedHistory.findIndex(
        (recording) => recording.level === level,
      );

      if (levelIndex == -1) {
        updatedHistory.push({
          level,
          pressedKeys: [{ keyCombination, timestamp }],
        });
      } else {
        updatedHistory[levelIndex].pressedKeys.push({
          keyCombination,
          timestamp,
        });
      }

      localStorage.setItem(
        "keyRecording",
        JSON.stringify(updatedHistory),
      );

      return updatedHistory;
    });
  };

  return {
    saveKeyStroke,
    keyRecording,
  };
}

export type IGameHistory = {
  saveKeyStroke: (level: number, keyCombination: string[]) => void;
  keyRecording: IKeyRecording;
};
