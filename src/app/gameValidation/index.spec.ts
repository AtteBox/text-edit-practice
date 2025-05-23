import { describe, it, expect } from "vitest";
import { validateKeyRecording, IKeyRecording } from ".";

describe("Game Validation", () => {
  it("successfull game playthrough", () => {
    const keyRecording = mapToVirtualTextareaKeyRecording(keysByLevel);
    const result = validateKeyRecording(keyRecording);
    expect(result).toBe(true);
  });
  it("fail in level 1", () => {
    const keyRecording = mapToVirtualTextareaKeyRecording(keysByLevel, {
      level: 1,
      keys: level1FailKeys,
    });
    const result = validateKeyRecording(keyRecording);
    expect(result).toBe(false);
  });
  it("fail in level 5", () => {
    const keyRecording = mapToVirtualTextareaKeyRecording(keysByLevel, {
      level: 5,
      keys: [],
    });
    const result = validateKeyRecording(keyRecording);
    expect(result).toBe(false);
  });
  it("invalid timestamps", () => {
    const keyRecording = mapToVirtualTextareaKeyRecording(keysByLevel);
    keyRecording[2].pressedKeys[3].timestamp = 0;
    const result = validateKeyRecording(keyRecording);
    expect(result).toBe(false);
  });
});

type IReplaceLevel = {
  level: number;
  keys: string[];
};

function mapToVirtualTextareaKeyRecording(
  keysByLevel_: string[][],
  replaceLevel?: IReplaceLevel,
): IKeyRecording {
  let previousKeyDownTimestamp = 0;
  return keysByLevel_.map((keys, index) => ({
    level: index + 1,
    pressedKeys: (replaceLevel?.level === index + 1 ? replaceLevel.keys! : keys)
      .map(mapToVirtualTextareaKeyCombination)
      .map((keyCombination) => ({
        keyCombination,
        timestamp: (previousKeyDownTimestamp += 100),
      })),
  }));
}

function mapToVirtualTextareaKeyCombination(keyCombination: string): string[] {
  const keys = keyCombination.split("+");
  if (keys.length === 1) {
    return [keys[0]];
  }
  if (keys.length === 2) {
    return [keys[0].replace("Control", "ctrl"), keys[1]];
  }
  return [];
}

const keysByLevel = [
  [
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
  ],
  [
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+Backspace",
    "Control+Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
  ],
  [
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
  ],
  [
    "ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
  ],
  [
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "ArrowLeft",
    "Control+Backspace",
  ],
];

const level1FailKeys = [
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+ArrowRight",
  "Control+ArrowRight",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
];
