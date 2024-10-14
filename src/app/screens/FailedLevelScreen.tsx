import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { IGameEngineResult } from "../engines/game";

function FailedLevelScreen({ game }: { game: IGameEngineResult }) {
  return (
    <div
      className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md"
      style={{
        opacity: game.levelFinished ? 1 : 0,
        transition: "opacity 2s ease",
      }}
    >
      <h1 className="text-2xl font-bold">
        Level {game.currentLevelNumber} Failed!
      </h1>
      <p className="text-sm">
        You need to get at least one point to finish each level. Please start
        the game again!
      </p>
      <LevelResultsBar levelResults={game} />
      <GameResultsBar game={game} alignRight />
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

export default FailedLevelScreen;
