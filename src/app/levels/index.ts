import { ILevel } from "../gameUtilities";

export const levels: ILevel[] = [
  {
    title: "Level 1: Control Backspace And Arrow Keys",
    description:
      "Remove the germs from the text area using control + backspace and control + left and right arrow keys.",
    startContent: [
      "🐶 🦠🦠 🐱🐱 🦠🦠🦠 🐹 🦠🦠🦠🦠 🐰🐰🐰",
      "🦠 🐶🐶🐱 🦠🦠🦠 🐹🐹 🦠🦠🦠🦠🦠 🐰",
      "🐶🐱 🦠🦠 🐹🐹🐹 🦠🦠🦠 🐰🐰 🦠🦠🦠🦠🦠🦠🦠",
      "🦠🦠🦠🦠 🐶🐱🐱 🦠🦠 🐹 🦠🦠🦠 🐰🐰🐰🐰",
      "🐶 🦠🦠🦠🦠🦠 🐱🐱🐱 🦠🦠 🐹🐹🐹🐹 🦠🦠🦠",
      "🦠🦠 🐶🐶 🦠🦠🦠🦠 🐱 🦠🦠🦠 🐹🐹 🦠🦠",
      "🐰 🦠 🐶🐶🐶 🦠🦠🦠🦠 🐱🐱 🦠🦠 🐹🐹🐹",
    ],
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
      "Remove the spiders using both control key combinations and normal keys. Use control combinations to delete entire spider words and normal keys to edit within mixed words.",
    startContent: [
      "🕷🕷 🐷🐮🐔 🕷🕷🕷 🐔🐮🕷 🕷🕷🕷🕷 🐷",
      "🐮🕷🐔 🕷🕷🕷 🐷🕷🐮 🕷🐷🕷 🐔🐮🐷 🕷🕷",
      "🕷🕷🕷 🐷🐮🕷 🕷🕷🕷🕷 🐔🕷🐔 🕷🕷",
      "🐷🕷🐮🐔 🕷 🐷🐮 🕷🕷🐔🕷 🐔🐮 🕷🕷🕷",
      "🐷 🕷🕷🕷 🐮🕷🐔 🕷🐮 🐷🐔🕷 🕷🕷🕷🕷",
      "🕷🕷 🐮🕷🐔 🕷🕷🕷🕷 🐷 🐮🐔🕷 🕷🕷",
      "🐔🕷🐷 🕷🕷🕷 🐮🕷🐮 🕷🐔 🐔🐷🐮 🕷🐷🕷",
      "🐮🕷🐷 🕷🕷🕷🕷 🐔🕷🐮🐷 🕷 🕷🕷🕷🕷",
      "🕷🕷🐷 🕷🕷 🕷🕷 🕷🕷🕷 🕷🐮🕷 🐮🐷",
      "🐔 🕷🐮 🕷🕷🕷🕷 🕷🐷🕷 🐔🐮🕷 🕷🐮 🐷",
      "🐮🐷 🕷🐔🕷🕷 🐔🕷 🕷🕷🐮 🐮🐷 🕷🕷",
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
      "Remove the germs from the text area using control + delete and control + left and right arrow keys.",
    startContent: [
      "🐵 🦠🦠🦠 🐨🐨🐨 🦠🦠🦠🦠 🐯 🦠🦠",
      "🦠 🐵🐵🐵 🦠🦠🦠🦠🦠 🐨 🦠🦠🦠 🐯🐯",
      "🐵🐨 🦠🦠 🐯🐯🐯 🦠🦠🦠 🐵🐵 🦠🦠🦠🦠",
      "🦠🦠🦠 🐵🐨🐨 🦠🦠 🐯 🦠🦠🦠🦠 🐵🐵🐵",
      "🐨 🦠🦠🦠🦠 🐯🐯🐯 🦠🦠🦠 🐵🐵🐵 🦠",
      "🦠🦠 🐨🐨 🦠🦠🦠 🐯 🦠🦠 🐵🐵 🦠🦠🦠",
      "🐯 🦠 🐨🐨🐨 🦠🦠🦠🦠 🐵🐵 🦠🦠🦠🦠🦠",
      "🦠🦠🦠🦠🦠 🐨🐯 🦠🦠 🐵🐵 🦠 🐨🐯🐵",
      "🐯🐵 🦠🦠🦠 🐨🐨 🦠🦠🦠🦠 🐯 🦠🦠🦠",
      "🦠🦠 🐵🐵 🦠🦠🦠🦠 🐨🐯 🦠 🐵🐨🐯",
      "🦠 🐯🐯🐵 🦠🦠 🐨🐨🐨 🦠🦠🦠 🐯🐵",
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
      "Remove the germs from the text area using the delete key, solely and together with control, to delete letters and entire germ words.",
    startContent: [
      "🐝🦠 🦠🦋🐌 🐞🦠🐝 🦠 🦠🦠 🦠🦠🦠 🦠🦠🦠🦠 🐝🦋 🐌🐞 🐝🦋🐌",
      "🦋🦠🐞 🐌🦠 🦠🐝🦋🐌 🦠🦠🦠🦠🦠 🦠🦠 🦠 🐞 🐝🦋🐌🐞 🐌🐝 🦋🐞🐌",
      "🐞🦠🦋🐝 🦠🐌 🐝🦠🦋 🦠🦠🦠🦠🦠🦠 🦠🦠🦠 🦠🦠 🦠 🐌🐞🐝 🦋 🐝🐌🐞",
      "🦠🐝🦋🐌🐞 🐞🦠 🐌🦠🦋 🦠🦠🦠🦠🦠🦠🦠 🦠🦠🦠🦠 🦠🦠 🐝 🦋🐌 🐞🐝🦋 🐌🐞🐝🦋",
      "🐝🦠🐞 🦠🦋🐌🐞 🦋🦠🐝 🦠 🦠🦠🦠 🦠🦠🦠🦠🦠 🦠🦠 🐞🦋🐌 🐝🐌 🦋🐞",
      "🐌🦠🐝🦋 🐞🦠🦋 🦠🐝🐌 🦠🦠🦠🦠 🦠🦠 🦠🦠🦠🦠🦠🦠 🐝🦋🐌🐞🐝 🐌 🐞🦋 🐝🐌🦋",
      "🦠🐞🐝🦋🐌 🐝🦠 🦋🦠🐌 🦠🦠🦠 🦠 🦠🦠🦠🦠🦠 🦠🦠🦠🦠🦠🦠🦠 🐞🐝 🐌🦋🐞 🐝",
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
      "Fantastic! You've effectively mastered the delete key now. Next we will use all the keys you've learned so far.",
    targetTimeSeconds: 120,
    pointCoefficient: 200,
  },
  {
    title: "Level 5: Mastering All Editing Techniques",
    description:
      "This is the ultimate test! Remove all the spiders from the text using all the key combinations you've learned so far. Use control key combinations for efficient word navigation and deletion, and use normal keys for precise character editing.",
    startContent: [
      "🐢🐴🦉 🕷🕷🕷 🐢🕷🐴 🕷🕷 🕷🕷 🐢🐴",
      "🕷🕷🕷 🐢🐴🦉 🕷🕷 🐢🕷🐴 🦉🦉 🕷🕷",
      "🐢🐴 🕷🕷🕷 🕷🕷 🕷🐴🕷 🕷🕷 🕷🕷",
      "🕷🕷🕷 🕷🕷 🐢🐴 🕷🕷🕷 🦉🦉 🐢🐴",
      "🕷🕷🕷 🐢🐴 🕷🦉🕷 🕷🕷 🕷🕷🕷 🦉",
      "🐢🐴 🦉🐢 🕷🕷🕷 🐴🦉 🕷🐢🕷 🐴🐢",
      "🕷🕷 🐢🐴 🦉🦉 🕷🕷🕷 🐢 🕷🐴🕷 🦉",
      "🕷🕷🕷 🕷🕷 🐢 🕷🕷 🕷🕷🕷 🐢🐴 🦉",
      "🕷🕷🕷 🐢 🕷🐴🕷 🕷🕷 🕷🕷 🐴 🕷🕷",
      "🐢🐴 🦉🐢 🕷🕷 🐴🦉 🕷🕷 🕷🕷🕷 🦉",
      "🐢🕷🐴 🦉🐢 🕷🕷 🐴 🕷🦉🕷 🐢 🕷🕷",
      "🕷🕷 🦉 🕷🕷🕷 🕷🕷 🦉🦉 🐢🕷🐴 🦉",
      "🕷🕷 🐢🐴 🕷🕷🕷 🦉🐢 🐴🐢 🦉 🕷🕷",
      "🕷🕷 🦉 🕷🐢🕷 🐴🦉 🕷🕷 🐢🐴 🦉🐢",
      "🕷🕷🕷 🐴 🕷🕷 🦉🐢 🕷🐴🕷 🦉 🕷🕷",
      "🕷🕷🕷 🐢 🕷🕷🕷 🐴🦉 🐢🐴 🕷🦉🕷",
      "🐢🐴 🕷🕷 🦉 🕷🕷🕷 🕷🕷 🦉 🐢 🕷🕷",
      "🐢🕷🐴 🦉 🕷🕷 🕷🕷 🦉🐢 🕷🐴🕷 🦉",
      "🕷🕷🕷 🐢 🕷🕷 🕷🕷 🐢🐴🦉 🕷🕷 🐢",
      "🐢🐴 🕷🕷 🕷🕷🕷 🐴🦉 🐢 🕷🐴🕷 🦉",
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
      "Outstanding! You've mastered deleting and navigating. Next up: selecting text with the Shift key.",
    targetTimeSeconds: 180,
    pointCoefficient: 250,
  },
  {
    title: "Level 6: Selecting Text with Shift",
    description:
      "Remove the germs by selecting them. Hold Shift with the arrow keys to grow a selection a letter or a word at a time, then press Backspace to delete it. Use the other navigation keys to move between the animal words you want to keep.",
    startContent: ["🐶🐶 🦠🦠🦠 🐱🐱", "🦠🦠 🐰🐰 🦠🦠🦠"],
    allowedKeyCombinations: [
      ["ctrl", "shift", "ArrowLeft"],
      ["ctrl", "shift", "ArrowRight"],
      ["shift", "ArrowLeft"],
      ["shift", "ArrowRight"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["Backspace"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Nicely done! Selecting text is the foundation for cutting, copying and pasting — which is exactly what's coming next.",
    targetTimeSeconds: 45,
    pointCoefficient: 150,
  },
  {
    title: "Level 7: Cut and Paste",
    description:
      "Rearrange the animals so the text matches the target below. Select a word with Shift, cut it with Ctrl+X, move the cursor where it belongs, and paste it with Ctrl+V. Tip: select the space along with the word so the spacing stays correct.",
    startContent: ["🐶 🐱 🐭"],
    targetContent: ["🐶 🐭 🐱"],
    allowedKeyCombinations: [
      ["ctrl", "x"],
      ["ctrl", "v"],
      ["shift", "ArrowLeft"],
      ["shift", "ArrowRight"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Great cut! Cutting moves text around. Copying, on the other hand, duplicates it — let's try that next.",
    targetTimeSeconds: 30,
    maxTimeSeconds: 90,
    pointCoefficient: 150,
  },
  {
    title: "Level 8: Copy and Paste",
    description:
      "Duplicate the animals so the text matches the target below. Select the words you want to copy with Shift, copy them with Ctrl+C, move to the end and paste them with Ctrl+V.",
    startContent: ["🐝 🐞 🦋"],
    targetContent: ["🐝 🐞 🦋 🐞 🦋"],
    allowedKeyCombinations: [
      ["ctrl", "c"],
      ["ctrl", "v"],
      ["shift", "ArrowLeft"],
      ["shift", "ArrowRight"],
      ["ctrl", "ArrowLeft"],
      ["ctrl", "ArrowRight"],
      ["ArrowLeft"],
      ["ArrowRight"],
    ],
    cursorStartPos: "end",
    postLevelMessage:
      "Outstanding! You've mastered selecting, cutting, copying and pasting. You're now a true text editing expert!",
    targetTimeSeconds: 30,
    maxTimeSeconds: 90,
    pointCoefficient: 200,
  },
];
