import Image from "next/image";
import startBanner from "../assets/start-banner.png";
import { IGameEngineResult } from "../engines/game";
import { useCallback, useState } from "react";

function StartScreen({ game }: { game: IGameEngineResult }) {
  const [username, setUsername] = useState("");
  const [validationMessage, setValidationMessage] = useState<
    string | undefined
  >(undefined);
  const handleStartGame = useCallback(() => {
    const { error } = game.startGame(username);
    setValidationMessage(error);
  }, [game, username]);
  return (
    <div className="flex flex-col gap-5 row-start-2 items-center max-w-md">
      <h1 className="text-2xl font-bold">Welcome to Typo Terminator!</h1>
      <p className="text-sm">
        A game where you eliminate unwanted characters swiftly!
      </p>
      <Image src={startBanner} alt="Typo Terminator Banner" />
      <div className="flex gap-4 mt-4 flex-row items-stretch h-13">
        <input
          className="rounded-md text-black placeholder:text-center p-2"
          type="text"
          placeholder="Enter your name"
          defaultValue={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleStartGame}
          className="text-center p-2 rounded-md bg-violet-600 hover:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-300"
        >
          Start Game
        </button>
      </div>
      <div className="text-red-500 text-sm min-h-5">{validationMessage}</div>
    </div>
  );
}

export default StartScreen;
