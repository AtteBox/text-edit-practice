import { useCallback, useEffect, useRef } from "react";
import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { IGameEngineResult } from "../engines/game";
import { IGameHistory } from "../engines/gameHistory";
import { useHighscoreState } from "../engines/highScore";
import Link from "next/link";

function EndScreen({
  game,
  gameHistory,
}: {
  game: IGameEngineResult;
  gameHistory: IGameHistory;
}) {
  const hasStartedSavingHighScore = useRef(false);
  const highScores = useHighscoreState();
  const saveHighScore = useCallback(() => {
    localStorage.setItem("keyRecording", JSON.stringify(gameHistory.keyRecording));
    highScores.saveHighScore({
      username: game.username!,
      score: game.totalPoints,
      gameHistory: gameHistory.keyRecording,
    });
  }, [game.username, game.totalPoints, gameHistory.keyRecording, highScores]);
  useEffect(() => {
    if (game.isGameFinished && !hasStartedSavingHighScore.current) {
      hasStartedSavingHighScore.current = true;
      saveHighScore();
    }
  }, [saveHighScore, game.isGameFinished]);
  const allLevels = [...game.previousLevels, game];
  return (
    <div className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md">
      <h1 className="text-2xl font-bold">Congratulations!</h1>
      <p className="text-sm">You&apos;ve completed all the levels!</p>
      <ol className="list-decimal">
        {allLevels.map((levelResults, index) => (
          <li key={index}>
            <LevelResultsBar levelResults={levelResults} />
          </li>
        ))}
      </ol>
      <GameResultsBar game={game} alignRight />
      {highScores.isLoading && (
        <p className="text-sm">Saving your high score...</p>
      )}
      {highScores.failedSavingHighScore && (
        <p className="text-sm text-red-500">
          Failed saving your high score. Please{" "}
          <button className="text-blue-500 underline" onClick={saveHighScore}>
            try again.
          </button>
        </p>
      )}
      {highScores.failedFetchingHighScore && (
        <p className="text-sm text-red-500">Failed fetching high scores. You can see the top results on the high scores page.</p>
      )}
      {highScores.finishedSuccessfully && (
        <>
          {highScores.playerIsInTop100 ? (
            <p className="text-sm text-green-500">
                Congrats! you reached the <Link href="/highscores" className="text-violet-400 hover:underline">top 100 highscores!</Link>
            </p>
          ) : (
            <p className="text-sm text-yellow-500">
              Unfortunately, you didn&apos;t reach the <Link href="/highscores" className="text-violet-400 hover:underline">top 100 highscores</Link>.
            </p>
          )}
        </>
      )}
      <div className="flex flex-col gap-4 items-end self-stretch">
        <button
          onClick={game.restartGame}
          className="p-2 rounded-md bg-violet-600 hover:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-300"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default EndScreen;
