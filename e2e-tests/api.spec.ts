import { test, expect } from "@playwright/test";
import { randomInt, randomUUID } from "crypto";

type HighScore = {
  score: number;
  username: string;
  gameHistory: string;
};

test("get endpoint should successfully return highscores", async ({
  request,
}) => {
  const result = await request.get("/api/highscores");
  expect(result.ok()).toBeTruthy();
});

test("post endpoint should successfully save a highscore", async ({
  request,
}) => {
  const newHighScore: HighScore = {
    score: 100,
    username: "test" + randomInt(281474976710655),
    gameHistory: "this is some game history " + randomUUID(),
  };
  const result = await request.post("/api/highscores", {
    data: newHighScore,
  });
  expect(result.ok()).toBeTruthy();
  const getResponse = await request.get("/api/highscores");
  const body = await getResponse.json();
  expect(body.items).toContainEqual(
    expect.objectContaining({
      score: newHighScore.score,
      username: newHighScore.username,
    }),
  );
});

test("validation should fail for invalid input", async ({ request }) => {
  const result = await request.post("/api/highscores", {
    data: {
      score: -1,
      username: "test",
      gameHistory: "this is some game history " + randomUUID(),
    },
  });
  expect(result.ok()).toBeFalsy();
  const body = await result.json();
  expect(body.errors).toContainEqual(
    expect.objectContaining({ code: "too_small" }),
  );
});

test("validation should prevent submitting the same game history twice", async ({
  request,
}) => {
  const gameHistory = "this is some new game history " + randomUUID();
  const result1 = await request.post("/api/highscores", {
    data: { score: 100, username: "test", gameHistory },
  });
  expect(result1.ok()).toBeTruthy();

  const result2 = await request.post("/api/highscores", {
    data: { score: 100, username: "test", gameHistory },
  });
  expect(result2.ok()).toBeFalsy();
  const body = await result2.json();
  expect(body.message).toBe("This game history has already been submitted.");
});

test("order of highscores should be correct", async ({ request }) => {
  const testScores = [
    ["c user", 3],
    ["a user", 1],
    ["d user", 4],
    ["b user", 2],
  ];
  for (const [username, score] of testScores) {
    const result = await request.post("/api/highscores", {
      data: {
        score,
        username,
        gameHistory: "this is some game history " + randomUUID(),
      },
    });
    expect(result.ok()).toBeTruthy();
  }

  const getResponse = await request.get("/api/highscores");
  const body = await getResponse.json();
  const highscores = Array.from(
    new Set(
      body.items
        // currently the database might return other items, so we need to filter them out
        .filter((item: HighScore) =>
          testScores.map((a) => a[0]).includes(item.username),
        )
        .map((item: HighScore) => item.username),
    ),
  );
  expect(highscores).toEqual(["d user", "c user", "b user", "a user"]);
});
