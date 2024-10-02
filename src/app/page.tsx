"use client";

import Image from "next/image";
import { start } from "repl";

function isMac() {
  return navigator.platform.toUpperCase().indexOf('MAC')>=0;
}

function ctrlEquivalentPressed(event: KeyboardEvent) {
  return isMac() ? event.altKey : event.ctrlKey;
}

export default function Home() {

  const level = {
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
      "🦠🦠🦠🦠 🐋🐳 🕷🕷🕷🕷 🐬🐟 🦠🕷🦠",
      "🐠🐡 🕷🕷 🦈🐙 🦠🦠🦠 🐚🐌 🕷🕷🕷",
      "🐞🐜 🦠🦠🕷 🦋🐛 🕷🕷🕷 🐝🐞 🦠🕷🕷",
      "🐜🐝 🦠🦠🦠🦠 🦋🐛 🕷🕷 🐔🐧 🦠🕷🦠",
      "🐦🐤 🦠🦠🕷 🐣🐥 🕷🕷🕷 🦆🦅 🦠🕷🦠",
      "🦉🦇 🦠🦠🕷 🐺🐗 🕷🕷🕷 🐴🦄 🦠🕷🕷",
      "🐝🐛 🦠🦠🦠 🐌🐚 🕷🕷🕷 🐞🐜 🦠🕷🕷",
      "🦂🐢 🕷🕷🕷 🐍🐊 🦠🦠🦠 🐋🐳 🕷🕷🕷",
      "🐬🐟 🦠🕷🕷 🐠🐡 🕷🕷🕷 🦈🐙 🦠🕷🦠",
      "🐘🐁 🕷🕷🕷 🐀🐿 🦠🦠🦠 🦔🦇 🕷🕷🕷",
      "🦡🦨 🦠🕷🕷 🦥🦦 🕷🕷🕷 🦘🦡 🦠🕷🦠",
      "🦝🦨 🕷🕷🕷 🦫🦦 🦠🦠🦠 🐕‍🦺🐩 🕷🕷🕷",
      "🐕🐈‍⬛ 🦠🕷🕷 🐈🐓 🕷🕷🕷 🦃🦚 🦠🕷🦠",
    ],
    // make the start content more interesting should be approximately 20 lines:
    allowedKeyCombinations: [["ctrl", "Backspace"], ["ctrl", "ArrowLeft"], ["ctrl", "ArrowRight"]],
  }

  const handleKeyDown = (e) => {
    for (const keyCombination of level.allowedKeyCombinations) {
      if(keyCombination.length === 1 && e.key === keyCombination[0]) {
        return;
      }
      if(keyCombination.length === 2) {
        const [ctrlKey, keyName] = keyCombination;
        if (ctrlKey === "ctrl" && ctrlEquivalentPressed(e) && e.key === keyName) {
          return;
        }
      }
    }
    console.log(e.key, e.ctrlKey, e.metaKey, e.altKey, e.shiftKey);
    e.preventDefault();
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <textarea cols={level.startContent[0].length} rows={level.startContent.length} defaultValue={level.startContent.join("\n")} onKeyDown={handleKeyDown}></textarea>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      TODO: is a footer needed?
      </footer>
    </div>
  );
}
