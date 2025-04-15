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
    if (!queryTop100HighScores.data || !highScoreIsSaved || !highScore) {
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

  return {
    saveHighScore,
    isLoading: highScoreIsSaved
      ? queryTop100HighScores.isLoading
      : saveHighScoreMutation.isPending,
    failedSavingHighScore: saveHighScoreMutation.isError,
    failedFetchingHighScore: queryTop100HighScores.isError,
    playerIsInTop100,
    finishedSuccessfully: playerIsInTop100 != null,
  };
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

export type IHighScoreState = {
  saveHighScore: (highScore: HighScore) => void;
  isLoading: boolean;
  failedSavingHighScore: boolean;
  failedFetchingHighScore: boolean;
  finishedSuccessfully: boolean;
  playerIsInTop100?: boolean;
};
