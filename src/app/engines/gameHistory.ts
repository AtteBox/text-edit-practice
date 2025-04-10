import { useCallback, useState } from "react";
import { IKeyRecording } from "../gameValidation";

export function useGameHistory(): IGameHistory {
  const [keyRecording, setKeyRecording] = useState<IKeyRecording>([]);

  const saveKeyStroke = useCallback(
    (level: number, keyCombination: string[]) => {
      const timestamp = Date.now();
      setKeyRecording((prev) => {
        const pressedKeys =
          prev.find((item) => item.level === level)?.pressedKeys ?? [];
        return [
          ...prev.filter((item) => item.level !== level),
          {
            level,
            pressedKeys: [...pressedKeys, { keyCombination, timestamp }],
          },
        ];
      });
    },
    [],
  );

  return {
    saveKeyStroke,
    keyRecording,
  };
}

export type IGameHistory = {
  saveKeyStroke: (level: number, keyCombination: string[]) => void;
  keyRecording: IKeyRecording;
};
