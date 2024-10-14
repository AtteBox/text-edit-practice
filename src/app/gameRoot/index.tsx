"use client";

import { useGameEngine } from "../engines/game";
import { levels } from "../levels";
import EndScreen from "../screens/endScreen";
import FailedLevelScreen from "../screens/failedLevelScreen";
import FinishedLevelScreen from "../screens/finishedLevelScreen";
import LevelScreen from "../screens/levelScreen";
import StartScreen from "../screens/startScreen";

export function GameRoot() {
    const game = useGameEngine({levels});
  
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-5 row-start-2 items-center sm:items-start">
          {!game.gameHasStarted && <StartScreen game={game} />}
          {game.gameHasStarted && !game.showLevelFinished && (
            <LevelScreen
              game={game}
            />
          )}
          {game.showLevelFinished && !game.isLastLevel && !game.levelFailed && (
            <FinishedLevelScreen
              game={game}
            />
          )}
          {game.showLevelFinished && game.levelFailed && (
            <FailedLevelScreen
              game={game}
            />
          )}
          {game.showLevelFinished && game.isLastLevel && (
            <EndScreen
              game={game}
            />
          )}
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <span className="text-xs">
            © Atte Virtanen {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    );
  }
  