import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { highScoreSchema } from "../../schema";

type HighScore = z.infer<typeof highScoreSchema>;

export function useHighscoreState(): IHighScoreState {
  const [highScore, setHighScore] = useState<HighScore>();
  const [highScoreIsSaved, setHighScoreIsSaved] = useState(false);

  const saveHighScoreMutation = useMutation({
    mutationFn: (highScore: HighScore) =>
      axios.post("/api/highscores", JSON.stringify(highScore)),
    onSuccess: () => {
      setHighScoreIsSaved(true);
    },
  });

  const queryTop100HighScores = useQuery({
    queryKey: ["highscoresTop100"],
    queryFn: () => axios.get("/api/highscores"),
    enabled: highScoreIsSaved,
  });

  const playerIsInTop100 = useMemo(() => {
    if (
      !queryTop100HighScores.data ||
      !highScoreIsSaved ||
      !highScore
    ) {
      return undefined;
    }
    return playerIsInTop100HighScores(
      queryTop100HighScores.data.data.items,
      highScore,
    );
  }, [queryTop100HighScores.data, highScoreIsSaved, highScore]);

  const saveHighScore = useCallback(
    (highScore: HighScore) => {
      setHighScore(highScore);
      saveHighScoreMutation.mutate(highScore);
    },
    [saveHighScoreMutation],
  );

  const state = combineRequestStates(
    saveHighScoreMutation.status,
    highScoreIsSaved,
    queryTop100HighScores.status,
  );

  console.log(
    "HighScore state",
    state,
    "saveHighScoreMutation",
    saveHighScoreMutation.status,
    "queryTop100HighScores",
    queryTop100HighScores.status,
    "playerIsInTop100",
    playerIsInTop100,
  );

  return {
    state,
    playerIsInTop100,
    saveHighScore,
  };
}

function combineRequestStates(
  saveHighScoreMutationStatus: RequestState,
  highScoreIsSaved: boolean,
  queryTop100HighScoresStatus: RequestState,
): RequestState {
  if (highScoreIsSaved) {
    return queryTop100HighScoresStatus;
  }
  return saveHighScoreMutationStatus;
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
  playerIsInTop100?: boolean;
  state: "idle" | "pending" | "error" | "success";
  saveHighScore: (highScore: HighScore) => void;
};
