import { GameResultsBar } from "../components/GameResultsBar";
import LevelResultsBar from "../components/LevelResultsBar";
import { IGameEngineResult } from "../engines/game";

function FinishedLevelScreen({
    game,
  }: {
    game: IGameEngineResult;
  }) {
    return (
      <div
        className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md"
        style={{
          opacity: game.levelFinished ? 1 : 0,
          transition: "opacity 2s ease",
        }}
      >
        <h1 className="text-2xl font-bold">
          Level {game.currentLevelNumber} Completed!
        </h1>
        <LevelResultsBar levelResults={game} />
        <GameResultsBar game={game} alignRight={false} />
        <p className="text-sm">{game.currentLevel.postLevelMessage}</p>
        <div className="flex flex-col gap-4 items-end self-stretch">
          <button
            onClick={game.startNextLevel}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Next Level
          </button>
        </div>
      </div>
    );
  }

  export default FinishedLevelScreen;
  