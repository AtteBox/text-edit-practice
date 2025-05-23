"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import gihubLogo from "../assets/github-mark-white.svg";
import { IGameEngineResult, useGameEngine } from "../engines/game";
import { levels } from "../levels";
import EndScreen from "../screens/EndScreen";
import FailedLevelScreen from "../screens/FailedLevelScreen";
import FinishedLevelScreen from "../screens/FinishedLevelScreen";
import LevelScreen from "../screens/LevelScreen";
import StartScreen from "../screens/StartScreen";
import { IGameHistory, useGameHistory } from "../engines/gameHistory";

export function GameRoot() {
  const game = useGameEngine({ levels });
  const gameHistory = useGameHistory();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-5 row-start-2 items-center sm:items-start">
        <Screen game={game} gameHistory={gameHistory} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span className="text-xs">
          © Atte Virtanen {new Date().getFullYear()}
          <a
            href="https://github.com/AtteBox/text-edit-practice"
            title="Open code in Github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={gihubLogo}
              alt="Github logo"
              className="w-4 h-4 ml-3 inline-block"
            />
          </a>
        </span>
      </footer>
    </div>
  );
}

function Screen({
  game,
  gameHistory,
}: {
  game: IGameEngineResult;
  gameHistory: IGameHistory;
}) {
  const [showLevelScreen, setShowLevelScreen] = useState(true);

  // Delay showing the level results screen for a second to make the transition smoother
  useEffect(() => {
    if (game.levelFinished) {
      setTimeout(() => {
        setShowLevelScreen(false);
      }, 1000);
    } else {
      setShowLevelScreen(true);
    }
  }, [game.levelFinished]);

  if (!game.gameHasStarted) {
    return <StartScreen game={game} />;
  }
  if (showLevelScreen) {
    return <LevelScreen game={game} gameHistory={gameHistory} />;
  }
  if (game.levelFailed) {
    return <FailedLevelScreen game={game} />;
  }
  if (game.isGameFinished) {
    return <EndScreen game={game} gameHistory={gameHistory} />;
  }
  if (game.levelFinished) {
    return <FinishedLevelScreen game={game} />;
  }
  return <></>;
}
