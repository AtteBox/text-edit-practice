import { IGameEngineResult } from "../engines/game";

export function GameResultsBar({
    game,
    alignRight,
  }: {
    game: IGameEngineResult;
    alignRight?: boolean;
  }) {
    return (
      <span className={"text-xs" + alignRight ? " self-end" : " self-start"}>
        Total Points: {game.totalPoints}
      </span>
    );
  }
  