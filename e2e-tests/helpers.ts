import { randomInt } from "crypto";
import { keysByLevel } from "./keySequences";
import { IGameHistory } from "./types";

export function createRandomUsername(): string {
  const randomNumber = randomInt(281474976710655);
  return "user" + randomNumber;
}

export function createRandomGameHistory(): IGameHistory {
  let previousKeyDownTimestamp = randomInt(281474976710655);
  return keysByLevel.map((keys, index) => ({
    level: index + 1,
    pressedKeys: keys
      .map(mapToVirtualTextareaKeyCombination)
      .map((keyCombination) => ({
        keyCombination,
        timestamp: (previousKeyDownTimestamp += 100),
      })),
  }));
}

function mapToVirtualTextareaKeyCombination(keyCombination: string): string[] {
  return keyCombination
    .split("+")
    .map((key) =>
      key === "Control" ? "ctrl" : key === "Shift" ? "shift" : key,
    );
}
