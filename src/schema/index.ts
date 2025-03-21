
import z from "zod";

const usernameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(
    /^(?=.*[a-zA-Z])[a-zA-Z0-9](?!.*  )[a-zA-Z0-9 ]*$/,
    "Username must consist letters, digits and spaces. There must be at least one letter. Multiple consecutive spaces are not allowed."
  );

export const highScoreSchema = z.object({
  score: z.number().min(0).max(1_000_000),
  username: usernameSchema,
  gameHistory: z.string().min(10).max(100000),
});
