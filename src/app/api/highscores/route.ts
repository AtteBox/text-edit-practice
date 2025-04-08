"use server";

import { PutItemCommand, QueryCommand, ScanCommand } from "dynamodb-toolbox";
import { randomUUID, createHash } from "crypto";
import { HighScore, HighScoresTable } from "@/db";
import { highScoreSchema } from "@/schema";
import { validateKeyRecording } from "@/app/gameValidation";

export async function POST(request: Request) {
  const receivedBody: unknown = await request.json();
  const { data, error } = await highScoreSchema.safeParseAsync(receivedBody);
  if (error) {
    return Response.json(
      {
        message: "Invalid input.",
        errors: error.errors.map(({ code, message, path }) => ({
          code,
          message,
          path,
        })),
      },
      { status: 400 }
    );
  }

  const { score, username, gameHistory } = data;

  const gameHistoryHashsum = calculateSHA256(JSON.stringify(gameHistory));

  if (await gameHistoryExists(gameHistoryHashsum)) {
    return Response.json(
      { message: "This game history has already been submitted." },
      { status: 403 }
    );
  }

  if (!validateKeyRecording(gameHistory)) {
    return Response.json(
      { message: "Invalid game history." },
      { status: 400 }
    );
  }

  await HighScore.build(PutItemCommand)
    .item({
      entityType: "highscore",
      entityId: createEntityId(score),
      username,
      score,
      date: Date.now(),
      gameHistoryHashsum,
    })
    .send();

  return Response.json({
    message: "High score has been successfully submitted.",
  });
}

export async function GET() {
  const queryResult = await HighScoresTable.build(QueryCommand)
    .query({
      partition: "highscore",
      limit: 100,
      reverse: true,
      attributes: ["entityId", "username", "score", "date"],
    })
    .send();

  const items = [...queryResult.Items!];
  items.reverse();

  return Response.json({ items });
}

function calculateSHA256(data: string) {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

async function gameHistoryExists(gameHistoryHashsum: string) {
  const scanResult = await HighScoresTable.build(ScanCommand)
    .options({
      index: "gameHistoryHashsumIndex",
      filter: { attr: "gameHistoryHashsum", eq: gameHistoryHashsum },
    })
    .send();

  return scanResult.Count! > 0;
}

function createEntityId(score: number) {
  return `${score.toString().padStart(15, "0")}_${randomUUID()}`;
}
