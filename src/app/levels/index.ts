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

export const germChars = ["🦠", "🕷"];
export const animalChars = [
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

export const levels: ILevel[] = [
  {
    title: "Level 1: Control Backspace And Arrow Keys",
    description:
      "Remove the germs and spiders from the text area using control + backspace and control + left and right arrow keys.",
    startContent: [
      "🐶🐱 🦠🦠🕷🦠 🐭🐹 🦠🦠🦠 🐰🦊 🕷🕷🕷 🐻🐼",
      "🦠🦠🕷🕷 🐨🐯 🦠🦠🕷 🦁🐮 🕷🕷🕷 🐷🐽",
      "🦠🕷🦠🕷 🐸🐵 🕷🕷🕷 🦠🦠🦠 🙈🙉 🕷🦠🕷",
      "🙊🐔 🦠🦠🦠🕷 🐧🐦 🕷🕷🕷 🐤🐣 🦠🦠🕷",
      "🐥🦆 🦠🕷🦠 🦅🦉 🕷🕷 🦇🐺 🦠🦠🦠 🐗🐴",
      "🕷🕷🕷 🦄🐝 🦠🦠🕷 🐛🦋 🕷🕷🕷 🐌🐚",
      "🦠🕷🕷🕷 🐞🐜 🦠🦠🦠 🦂🐢 🕷🕷 🐍🐊",
    ],
    // make the start content more interesting should be approximately 20 lines:
    allowedKeyCombinations: [
      ["ctrl", "Backspace"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Congratulations for passing level 1! You should also learn to sometimes release the control key before pressing the next combination and that's what we will practice in the next level.",
    targetTimeSeconds: 60,
    pointCoefficient: 100,
  },
  {
    title: "Level 2: Mixing Control and Normal Keys for Efficiency",
    description:
      "Remove the germs and spiders from the text using both control key combinations and normal keys. Use control combinations to delete entire germ words and normal keys to edit within mixed words.",
    startContent: [
      "🦠🦠🕷🕷 🐶🐱🦠🐭 🦠🦠🦠🕷 🐹🐰🐰",
      "🕷🕷🕷🕷 🐻🐼🐶 🦠🐨🐯🦠 🦁🐮🐱",
      "🦠🦠🦠🕷 🐷🐽🐰 🕷🐸🐵🦠 🐶🦠🐱",
      "🐭🐹🕷🐰 🐰🕷🐶🐱 🕷🦠🕷🕷 🐻🐼🐶",
      "🦠🦠🦠🦠 🐨🐯🐷 🦠🐮🐽🦠 🐸🐵🐶",
      "🐶🐱🦠🐭 🦠🕷🐹🐰 🕷🕷🕷🕷 🐻🐼🐶",
      "🦠🦠🕷🦠 🐨🐯🕷🐷 🕷🕷🐮🐽 🦠🐸🐵",
      "🐶🦠🐱🐭 🦠🦠🦠🕷 🐹🦠🐰🐰 🕷🕷🕷🕷",
      "🦠🦠🦠🦠 🐻🐼🐶 🕷🕷🕷🕷 🐨🐯🐷",
      "🦠🐮🕷🐽 🐸🐵🦠🦠 🐶🐱🕷🐭 🕷🕷🕷🕷",
      "🐹🐰🦠🐰 🦠🕷🕷🕷 🐻🐼🕷🐶 🦠🦠🦠🦠",
    ],
    allowedKeyCombinations: [
      // Control key combinations
      ["ctrl", "Backspace"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      // Normal keys
      ["Backspace"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Great job! You've learned to use both control and normal keys effectively. In the next level, we will introduce the delete key to help editing from left to right.",
    targetTimeSeconds: 90,
    pointCoefficient: 150,
  },
  {
    title: "Level 3: Control Delete, and Arrow Keys",
    description:
      "Remove the germs and spiders from the text area using control + backspace, delete, and control + left and right arrow keys.",
    startContent: [
      "🐶🐱 🦠🦠🦠🦠 🐭🐹 🕷🕷🕷🕷 🐰🦊 🦠🦠🦠🦠 🐻🐼",
      "🕷🕷🕷🕷 🐨🐯 🦠🦠🦠🦠 🦁🐮 🕷🕷🕷🕷 🐷🐽",
      "🦠🦠🦠🦠 🐸🐵 🕷🕷🕷🕷 🦠🦠🦠🦠 🙈🙉 🦠🦠🦠🦠",
      "🕷🕷🕷🕷 🙊🐔 🦠🦠🦠🦠 🐧🐦 🕷🕷🕷🕷 🐤🐣",
      "🦠🦠🦠🦠 🐥🦆 🕷🕷🕷🕷 🦅🦉 🦠🦠🦠🦠 🦇🐺",
      "🕷🕷🕷🕷 🐗🐴 🦠🦠🦠🦠 🦄🐝 🕷🕷🕷🕷 🐛🦋",
      "🦠🦠🦠🦠 🐌🐚 🕷🕷🕷🕷 🐞🐜 🦠🦠🦠🦠 🦂🐢",
      "🕷🕷🕷🕷 🐍🐊 🦠🦠🦠🦠 🐋🐳 🕷🕷🕷🕷 🐬🐟",
      "🦠🦠🦠🦠 🐠🐡 🕷🕷🕷🕷 🦈🐙 🦠🦠🦠🦠 🐚🐌",
      "🕷🕷🕷🕷 🐞🐜 🦠🦠🦠🦠 🦋🐛 🕷🕷🕷🕷 🐝🐞",
      "🦠🦠🦠🦠 🐜🐝 🕷🕷🕷🕷 🦋🐛 🦠🦠🦠🦠 🐔🐧",
    ],
    allowedKeyCombinations: [
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["ctrl", "Delete"],
    ],
    cursorStartPos: "start",
    postLevelMessage:
      "Excellent! You've mastered using the delete key together with control for efficient text editing. In the next level, we will introduce the delete key without control to help editing within words also.",
    targetTimeSeconds: 70,
    pointCoefficient: 150,
  },
  {
    title:
      "Level 4: Combining Control Delete And Just Delete for Word and Character Editing",
    description:
      "Remove the germs and spiders from the text area using the delete key, solely and together with control, to delete letters and entire germ words.",
    startContent: [
      "🦠🦠🕷🕷 🐶🐱🦠🐭 🦠🦠🦠🕷 🐹🐰🐰",
      "🕷🕷🕷🕷 🐻🐼🐶 🦠🐨🐯🦠 🦁🐮🐱",
      "🦠🦠🦠🕷 🐷🐽🐰 🕷🐸🐵🦠 🐶🦠🐱",
      "🐭🐹🕷🐰 🐰🕷🐶🐱 🕷🦠🕷🕷 🐻🐼🐶",
      "🦠🦠🦠🦠 🐨🐯🐷 🦠🐮🐽🦠 🐸🐵🐶",
      "🐶🐱🦠🐭 🦠🕷🐹🐰 🕷🕷🕷🕷 🐻🐼🐶",
      "🦠🦠🕷🦠 🐨🐯🕷🐷 🕷🕷🐮🐽 🦠🐸🐵",
      "🐶🦠🐱🐭 🦠🦠🦠🕷 🐹🦠🐰🐰 🕷🕷🕷🕷",
      "🦠🦠🦠🦠 🐻🐼🐶 🕷🕷🕷🕷 🐨🐯🐷",
      "🦠🐮🕷🐽 🐸🐵🦠🦠 🐶🐱🕷🐭 🕷🕷🕷🕷",
      "🐹🐰🦠🐰 🦠🕷🕷🕷 🐻🐼🕷🐶 🦠🦠🦠🦠",
    ],
    allowedKeyCombinations: [
      ["ctrl", "Delete"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["Delete"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "start",
    postLevelMessage:
      "Fantastic! You've effectively master the delete key now. Next we will use all the keys you've learned so far.",
    targetTimeSeconds: 120,
    pointCoefficient: 200,
  },
  {
    title: "Level 5: Mastering All Editing Techniques",
    description:
      "This is the ultimate test! Remove all the germs and spiders from the text using all the key combinations you've learned so far. Use control key combinations for efficient word navigation and deletion, and use normal keys for precise character editing.",
    startContent: [
      "🐶🕷🐱🦠🐭 🕷🕷🕷🦠 🕷🕷🕷🦠🕷 🦊🕷🐻🦠🐼",
      "🕷🐨🕷🐯🦠 🕷🕷🕷🦠🕷 🕷🐽🕷🐸🦠🕷",
      "🕷🙈🦠🕷🙉 🕷🕷🕷🕷🕷🐭 🦠🦠🕷🐰🕷",
      "🦊🕷🐻🦠🕷🐼 🐱🐱 🕷🦠🕷🦠🕷 🦁🕷🐮🦠",
      "🕷🦠🕷🦠🦠 🐸🕷🦠🐵🕷 🦠🕷🦠🕷🦠",
      "🦠🐱🕷🐭🕷 🦠🦠🕷🦠🕷🐰 🕷🦠🕷🦠🕷",
      "🦠🐼🕷🐨🕷 🐯🕷🦁🕷🐮 🕷🦠🐷🕷🐽",
      "🕷🦠🕷🦠🦠🕷 🕷🦠🕷🦠🦠 🕷🦠🕷🦠",
      "🦠🐭🕷🐹🦠 🕷🦠 🐼🐼🐼 🕷🦠🕷 🦠🕷🐻🕷🦠",
      "🕷🦠🕷🦠🕷 🦠🕷🦁🕷🦠 🕷🦠🕷🦠🕷",
      "🦠🕷🦠🦠🕷🦠 🕷🦠🕷🦠🕷 🐶🦠🕷🐱",
      "🕷🐭🕷 🐹🐹 🕷🦠 🕷🦠🕷🦠🕷 🦊🕷🐻🕷",
      "🦠🕷🦠🕷🦠 🕷🦠🕷🦠🕷 🕷🐮🦠🕷🦠",
      "🕷🐽🕷🐸🕷🦠 🕷🦠🕷🦠🕷 🕷🐶🕷🐱",
      "🦠🕷🐭🕷🦠 🕷🦠🦠🕷🦠 🕷🦊🕷🐻🕷",
      "🦠🕷🐼🕷🦠 🕷🦠🕷🦠🕷 🕷🐮🕷🦠🕷",
      "🦠🕷🦠🕷🦠 🕷🦠🕷🦠🕷 🕷🦠🕷🦠🕷",
      "🕷🐶🕷🐱🕷 🦠🦠🕷🦠🕷 🕷🦠🕷🦠🕷",
      "🕷🦊🕷🐻🕷🦠 🕷🐼🕷🦠🕷 🕷🐯🕷🦁",
      "🕷🦠🕷🐮🕷 🕷🐷🕷🐽🕷 🕷🐸🕷🦠🕷",
    ],
    allowedKeyCombinations: [
      // Control key combinations
      ["ctrl", "Backspace"],
      ["ctrl", "Delete"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      // Normal keys
      ["Backspace"],
      ["Delete"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "middle",
    postLevelMessage:
      "Outstanding! You've mastered all the editing techniques. You're now a text editing expert!",
    targetTimeSeconds: 180,
    pointCoefficient: 250,
  },
];
