"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

function isMac() {
  return navigator.platform.toUpperCase().indexOf('MAC')>=0;
}

function ctrlEquivalentPressed(event: KeyboardEvent) {
  return isMac() ? event.altKey : event.ctrlKey;
}

type IGameState = {
  germs?: number;
  animals?: number;
  currentLevel: number;
}

const germChars = ["🦠", "🕷"];
const animalChars = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐚", "🐞", "🐜", "🦂", "🐢", "🐍", "🐊"];

function getAnimalCount(text: string) {
  let count = 0;
  for(const char of text) {
    if(animalChars.includes(char)) {
      count++;
    }
  }
  return count
}

function getGermCount(text: string) {
  let count = 0;
  for(const char of text) {
    if(germChars.includes(char)) {
      count++;
    }
  }
  return count
}

const levels = [{
  title: "Level 1: Control Backspace And Arrow Keys",
  description: "Remove the germs and spiders from the text area using control + backspace and control + left and right arrow keys.",
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
  allowedKeyCombinations: [["ctrl", "Backspace"], ["ctrl", "ArrowLeft"], ["ctrl", "ArrowRight"]],
  cursorStartPos: "end",
  postLevelMessage: "Congratulations for passing level 1! You should also learn to sometimes release the control key before pressing the next combination and that's what we will practice in the next level.",
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
    ["ArrowRight"]
  ],
  cursorStartPos: "end",
  postLevelMessage:
    "Great job! You've learned to use both control and normal keys effectively. In the next level, we will introduce the delete key to help editing from left to right.",
},{
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
    ["ctrl", "Delete"]
  ],
  cursorStartPos: "start",
  postLevelMessage:
    "Excellent! You've mastered using the delete key together with control for efficient text editing. In the next level, we will introduce the delete key without control to help editing within words also.",
},{
  title: "Level 4: Combining Control Delete And Just Delete for Word and Character Editing",
  description:
    "Remove the germs and spiders from the text area using the delete key, solely and together with control, to delete letters and entire germ words.",
  startContent: [
    "🐶🦠🐱 🕷🕷🕷🕷 🐭🐹🦠 🦠🦠🕷🐰 🦊🐻🦠",
    "🕷🐼🐨🦠 🐯🕷🦁🐮 🦠🐷🐽🕷 🐸🦠🐵🕷",
    "🕷🙈🦠🙉 🐶🐱🦠🐭 🦠🦠🕷🕷 🐹🐰🕷🐰",
    "🦊🐻🕷🦠 🕷🐼🐨🕷 🐯🕷🦁🐮 🕷🦠🐷🐽",
    "🦠🐸🕷🐵 🕷🙈🦠🙉 🐶🦠🐱🕷 🐭🕷🐹🦠",
    "🕷🐰🐰🕷 🐻🦊🕷🕷 🦠🐼🐨🦠 🐯🕷🦁🕷",
    "🐮🕷🦠🐷 🐽🕷🐸🕷 🐵🕷🙈🦠 🐶🐱🕷🐭",
    "🦠🕷🕷🐹 🐰🕷🐰🦊 🕷🐻🕷🦠 🕷🐼🕷🐨",
    "🦠🕷🐯🕷 🦁🕷🐮🦠 🕷🐷🕷🐽 🐸🕷🦠🐵",
    "🕷🙈🕷🙉 🕷🐶🕷🐱 🦠🐭🕷🐹 🦠🕷🐰🕷",
  ],
  allowedKeyCombinations: [
    ["ctrl", "Delete"],
    ["ctrl", "ArrowLeft"],
    ["ctrl", "ArrowRight"],
    ["Delete"],
    ["ArrowLeft"],
    ["ArrowRight"]
  ],
  cursorStartPos: "start",
  postLevelMessage:
    "Fantastic! You've effectively master the delete key now. Next we will use all the keys you've learned so far.",
},{
  title: "Level 5: Mastering All Editing Techniques",
  description:
    "This is the ultimate test! Remove all the germs and spiders from the text using all the key combinations you've learned so far. Use control key combinations for efficient word navigation and deletion, and use normal keys for precise character editing.",
  startContent: [
    "🐶🕷🐱🦠🐭 🕷🕷🕷🦠 🐹🕷🐰🦠🐰 🦊🕷🐻🦠🐼",
    "🕷🐨🕷🐯🦠 🦁🕷🐮🦠🐷 🕷🐽🕷🐸🦠🐵",
    "🕷🙈🦠🕷🙉 🕷🐶🕷🐱🕷🐭 🦠🐹🕷🐰🕷",
    "🦊🕷🐻🦠🕷🐼 🕷🐨🕷🐯🕷 🦁🕷🐮🦠",
    "🕷🐷🕷🐽🦠 🐸🕷🦠🐵🕷 🙈🕷🙉🕷🐶",
    "🦠🐱🕷🐭🕷 🐹🦠🕷🐰🕷🐰 🕷🦊🕷🐻🕷",
    "🦠🐼🕷🐨🕷 🐯🕷🦁🕷🐮 🕷🦠🐷🕷🐽",
    "🕷🐸🕷🦠🐵🕷 🕷🙈🕷🦠🙉 🕷🐶🕷🐱",
    "🦠🐭🕷🐹🦠 🕷🐰🕷🐰🕷 🦊🕷🐻🕷🦠",
    "🕷🐼🕷🐨🕷 🐯🕷🦁🕷🐮 🕷🦠🕷🐷🕷",
    "🐽🕷🐸🦠🕷🐵 🕷🙈🕷🙉🕷 🐶🦠🕷🐱",
    "🕷🐭🕷🐹🕷🦠 🕷🐰🕷🐰🕷 🦊🕷🐻🕷",
    "🦠🕷🐼🕷🐨 🕷🐯🕷🦁🕷 🕷🐮🦠🕷🐷",
    "🕷🐽🕷🐸🕷🦠 🕷🐵🕷🙈🕷 🕷🐶🕷🐱",
    "🦠🕷🐭🕷🐹 🕷🦠🐰🕷🐰 🕷🦊🕷🐻🕷",
    "🦠🕷🐼🕷🐨 🕷🐯🕷🦁🕷 🕷🐮🕷🦠🕷",
    "🦠🕷🐷🕷🐽 🕷🐸🕷🦠🕷 🕷🐵🕷🙈🕷",
    "🕷🐶🕷🐱🕷 🦠🐭🕷🐹🕷 🕷🐰🕷🐰🕷",
    "🕷🦊🕷🐻🕷🦠 🕷🐼🕷🐨🕷 🕷🐯🕷🦁",
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
}]


export default function Home() {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [gameState, setGameState] = useState<IGameState>({currentLevel: 1});
  const level = levels[gameState.currentLevel - 1];
  const totalGerms = getGermCount(level.startContent.join(""));
  const totalAnimals = getAnimalCount(level.startContent.join(""));
  const [showLevelFinishedAnimation, setShowLevelFinishedAnimation] = useState(false);

  const updateGameState = useCallback(() => {
    if(!textAreaRef.current) {
      return;
    }
    console.log(updateGameState, textAreaRef.current.value);
    const germs = getGermCount(textAreaRef.current.value);
    const animals = getAnimalCount(textAreaRef.current.value);
    setGameState(state => ({ ...state, germs, animals }));
  }, []);


  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(e.key, e.ctrlKey, e.metaKey, e.altKey, e.shiftKey);
    for (const keyCombination of level.allowedKeyCombinations) {
      if(keyCombination.length === 1 && e.key === keyCombination[0]) {
        // propagate the event to the base event handler, and then update the game state
        setTimeout(() => updateGameState(), 0);
        return;
      }
      if(keyCombination.length === 2) {
        const [ctrlKey, keyName] = keyCombination;
        if (ctrlKey === "ctrl" && ctrlEquivalentPressed(e) && e.key === keyName) {
          setTimeout(() => updateGameState(), 0);
          return;
        }
      }
    }
    // prevent disallowed key combinations
    e.preventDefault();
  }

  // focus the text area when the level changes
  useEffect(() => {
    if(textAreaRef.current) {
    textAreaRef.current.focus();
    switch(level.cursorStartPos) {
      case "start":
        textAreaRef.current.selectionStart = 0;
        break;
      case "middle":
        textAreaRef.current.selectionStart = Math.floor(textAreaRef.current.value.length / 2);
        break;
      case "end":
        textAreaRef.current.selectionStart = textAreaRef.current.value.length;
        break;
    }
    updateGameState();
  }
  }, [level, updateGameState]);

  // when there are no germs left, show the level finished animation
  useEffect(() => {
    if(gameState.germs === 0) {
      setShowLevelFinishedAnimation(true);
    }
  }, [gameState.germs]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-5 row-start-2 items-center sm:items-start">
        {showLevelFinishedAnimation && (<>
          <h1 className="text-2xl font-bold">Level {gameState.currentLevel} finished!</h1>
          <p className="text-sm">{level.postLevelMessage}</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => {
              setShowLevelFinishedAnimation(false);
              setGameState(state => ({...state, currentLevel: state.currentLevel + 1}));
            }} className="p-2 bg-blue-500 text-white rounded-lg">Next Level</button>
          </div>
          </>
        )}
        {!showLevelFinishedAnimation && (<>
          <h1 className="text-2xl font-bold">{level.title}</h1>
          <p className="text-sm">{level.description}</p>
          <div className="flex gap-4">
            <p className="text-sm">Germs: {gameState.germs}/{totalGerms}</p>
            <p className="text-sm">Animals: {gameState.animals}/{totalAnimals}</p>
          </div>
       <textarea ref={textAreaRef} cols={level.startContent[0].length} rows={level.startContent.length} defaultValue={level.startContent.join("\n")} className="p-2 rounded-lg resize-none text-black font-extrabold" onKeyDown={handleKeyDown}></textarea>
        <span className="text-sm">Allowed key combinations:</span>
        <div className="flex flex-wrap gap-4">
        {level.allowedKeyCombinations.map((keyCombination, index) => (
          <KeyCombinationTag key={keyCombination.join('-')} keyCombination={keyCombination} />
        ))}
        </div>
        <p className="text-sm">Note: The cursor is at the beginning in the {level.cursorStartPos}.</p>
        </>
      )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <span className="text-xs">© Atte Virtanen {(new Date()).getFullYear()}</span>
      </footer>
    </div>
  );
}

function KeyCombinationTag({keyCombination}: {keyCombination: string[]}) {
  const keyText: Record<string, string> = {
    "ctrl": "Control",
    "Backspace": "Backspace",
    "ArrowLeft": "Left Arrow",
    "ArrowRight": "Right Arrow",
    "Delete": "Delete",
    "option": "Option",
    "fn": "Fn",
  }
  const keyCombinationExplanation: Record<string, string | Record<string, string>> = {
    "ctrl": {
      "Backspace": "Remove word to the left",
      "ArrowLeft": "Move cursor to the left word",
      "ArrowRight": "Move cursor to the right word",
      "Delete": "Delete word to the right",
    },
    "Backspace": "Delete character to the left",
    "ArrowLeft": "Move to the character on the left",
    "ArrowRight": "Move to the character on the right",
    "Delete": "Delete character to the right",
    }
  
  let actualKeyCombination = keyCombination
  if(isMac()) {
    actualKeyCombination = actualKeyCombination.map(key => key === "ctrl" ? "option" : key);
    actualKeyCombination = actualKeyCombination.flatMap(key => key === "Delete" ? ['fn', 'Backspace'] : key);
  }
  return (
    <div className="inline-block m-2">
      <span className="inline-block p-1 bg-gray-100 rounded-lg text-black m-1">
      
    <span className="inline-block p-1 bg-gray-100 rounded-lg text-black m-1">{actualKeyCombination.map(k => keyText[k]).join(" + ")}
    </span>
    </span>
    <br/>
      <span className="text-xs">(
        {
      // @ts-ignore
      keyCombination.reduce((acc, curr)=> acc[curr], keyCombinationExplanation)
      }
      )</span>
      </div>
  )
}
