export type ICursorStartPos = "start" | "middle" | "end";

export type ILevel = {
  title: string;
  description: string;
  startContent: string[];
  allowedKeyCombinations: string[][];
  cursorStartPos: ICursorStartPos;
  postLevelMessage: string;
  targetTimeSeconds: number;
  pointCoefficient: number;
};

const germChars = ["🦠", "🕷"];
const animalChars = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐽",
  "🐸",
  "🐵",
  "🙈",
  "🙉",
  "🙊",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🐣",
  "🐥",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐚",
  "🐞",
  "🐜",
  "🦂",
  "🐢",
  "🐍",
  "🐊",
];

export function getAnimalCount(text: string) {
  let count = 0;
  for (const char of text) {
    if (animalChars.includes(char)) {
      count++;
    }
  }
  return count;
}

export function getGermCount(text: string) {
  let count = 0;
  for (const char of text) {
    if (germChars.includes(char)) {
      count++;
    }
  }
  return count;
}

/**
 * Get a color for a ratio where 0 is bad and 1 is good
 * @param ratio number between 0-1
 * @returns css color string
 */
export function getDangerColor(ratio: number): string {
  const red = 255 * Math.min(1, 2 * ratio);
  const green = 255 * Math.min(1, 2 - 2 * ratio);
  return `rgb(${red}, ${green}, 0)`;
}
