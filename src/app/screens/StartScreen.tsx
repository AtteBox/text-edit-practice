import Image from "next/image";
import startBanner from "../assets/start-banner.png";
import { IGameEngineResult } from "../engines/game";

function StartScreen({ game }: { game: IGameEngineResult }) {
  return (
    <div className="flex flex-col gap-5 row-start-2 items-center sm:items-start max-w-md">
      <h1 className="text-2xl font-bold">Welcome to Typo Terminator!</h1>
      <p className="text-sm">
        A game where you eliminate unwanted characters swiftly!
      </p>
      <Image src={startBanner} alt="Typo Terminator Banner" />
      <div className="flex flex-col gap-4 items-end self-stretch">
        <button
          onClick={game.startGame}
          className="p-2 rounded-md bg-violet-600 hover:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-300"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
