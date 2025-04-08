import { useCallback, useEffect, useRef } from "react";
import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { IGameEngineResult } from "../engines/game";
import { IGameHistory } from "../engines/gameHistory";
import { useHighscoreState } from "../engines/highScore";

function EndScreen({
  game,
  gameHistory,
}: {
  game: IGameEngineResult;
  gameHistory: IGameHistory;
}) {
  const hasTriedToSaveHighScore = useRef(false);
  const highScores = useHighscoreState();
  const saveHighScore = useCallback(() => {
    highScores.saveHighScore({
      username: game.username!,
      score: game.totalPoints,
      gameHistory: gameHistory.keyRecording,
    });
  }, [game.username, game.totalPoints, gameHistory.keyRecording, highScores]);
  useEffect(() => {
    if (game.isGameFinished && !hasTriedToSaveHighScore.current) {
      hasTriedToSaveHighScore.current = true;
      saveHighScore();
    }
  }, [saveHighScore, game.isGameFinished]);
  const allLevels = [...game.previousLevels];
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
      {highScores.state === "pending" && (
        <p className="text-sm">Saving your high score...</p>
      )}
      {highScores.state === "error" && (
        <p className="text-sm text-red-500">
          Failed to save your high score. Please{" "}
          <button className="text-blue-500 underline" onClick={saveHighScore}>
            try again.
          </button>
        </p>
      )}
      {highScores.state === "success" && (
        <>
          <p className="text-sm text-green-500">
            Your high score has been saved!
          </p>
          {highScores.playerIsInTop100 && (
            <p className="text-sm text-green-500">
              You are in the top 100 high scores!
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
