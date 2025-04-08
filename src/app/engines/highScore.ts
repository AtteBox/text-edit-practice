import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { highScoreSchema } from "../../schema";

type HighScore = z.infer<typeof highScoreSchema>;

export function useHighscoreState(): IHighScoreState {
  const [highScore, setHighScore] = useState<HighScore>();

  const saveHighScoreMutation = useMutation({
    mutationFn: (highScore: HighScore) =>
      axios.post("/api/highscores", JSON.stringify(highScore)),
  });

  const queryTop100HighScores = useQuery({
    queryKey: ["highscoresTop100"],
    queryFn: () => axios.get("/api/highscores"),
    enabled: saveHighScoreMutation.isSuccess,
  });

  const playerIsInTop100 = useMemo(() => {
    if (
      !queryTop100HighScores.data ||
      !saveHighScoreMutation.isSuccess ||
      !highScore
    ) {
      return false;
    }
    return playerIsInTop100HighScores(
      queryTop100HighScores.data.data.items,
      highScore,
    );
  }, [queryTop100HighScores.data, saveHighScoreMutation.isSuccess, highScore]);

  const saveHighScore = useCallback(
    (highScore: HighScore) => {
      setHighScore(highScore);
      saveHighScoreMutation.mutate(highScore);
    },
    [saveHighScoreMutation],
  );

  return {
    state: combineRequestStates(
      saveHighScoreMutation.status,
      queryTop100HighScores.status,
    ),
    playerIsInTop100,
    saveHighScore,
  };
}

function combineRequestStates(
  highScoresFetchState: RequestState,
  highScoreSaveState: RequestState,
): RequestState {
  const requestStates = [highScoresFetchState, highScoreSaveState];
  if (requestStates.includes("error")) {
    return "error";
  }
  if (requestStates.includes("pending")) {
    return "pending";
  }
  if (requestStates.every((rs) => rs === "success")) {
    return "success";
  }
  return "idle";
}

function playerIsInTop100HighScores(
  highScores: HighScore[],
  playerHighScore: HighScore,
): boolean {
  return highScores.some(
    (highScore) =>
      highScore.username === playerHighScore.username &&
      highScore.score === playerHighScore.score,
  );
}

type RequestState = "idle" | "pending" | "error" | "success";

export type IHighScoreState = {
  playerIsInTop100: boolean;
  state: "idle" | "pending" | "error" | "success";
  saveHighScore: (highScore: HighScore) => void;
};
