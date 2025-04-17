import z from "zod";

export const usernameSchema = z
  .string()
  .min(2, { message: "Username must be at least 2 characters." })
  .max(20, { message: "Username must be at most 20 characters." })
  .regex(
    /^(?=.*[a-zA-Z])[a-zA-Z0-9](?!.*  )[a-zA-Z0-9 ]*$/,
    "Must consist of letters, digits and spaces. At least one letter. Consecutive spaces are not allowed.",
  );

const LAST_LEVEL = 5;
const MAX_KEYS_IN_LEVEL = 3000;
const gameHistorySchema = z
  .array(
    z.object({
      level: z.number().min(1).max(LAST_LEVEL),
      pressedKeys: z
        .array(
          z.object({
            keyCombination: z.array(z.string()),
            timestamp: z.number().min(0),
          }),
        )
        .max(MAX_KEYS_IN_LEVEL),
    }),
  )
  .min(LAST_LEVEL)
  .max(LAST_LEVEL)
  .refine(
    (gameHistory) => {
      const levelNumbers = gameHistory.map((recording) => recording.level);
      const uniqueLevels = new Set(levelNumbers);
      return (
        uniqueLevels.size === levelNumbers.length &&
        levelNumbers.every((level) => level >= 1 && level <= LAST_LEVEL)
      );
    },
    {
      message: `Levels must be unique and between 1 and ${LAST_LEVEL}.`,
    },
  );

export const highScoreSchema = z.object({
  score: z.number().min(0).max(1_000_000),
  username: usernameSchema,
  gameHistory: gameHistorySchema,
});
