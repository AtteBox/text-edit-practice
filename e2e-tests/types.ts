export type IGameHistory = {
  level: number;
  pressedKeys: { keyCombination: string[]; timestamp: number }[];
}[];

export type HighScore = {
  score: number;
  username: string;
  gameHistory: IGameHistory;
};
