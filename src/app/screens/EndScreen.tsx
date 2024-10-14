import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { IGameEngineResult } from "../engines/game";

function EndScreen({ game }: { game: IGameEngineResult }) {
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
      <div className="flex flex-col gap-4 items-end self-stretch">
        <button
          onClick={game.restartGame}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default EndScreen;
