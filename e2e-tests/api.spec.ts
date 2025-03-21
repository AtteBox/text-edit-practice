import { test, expect, Page } from "@playwright/test";
import { randomUUID } from "crypto";

test("get endpoint should successfully return highscores", async ({
  request,
}) => {
  const result = await request.get("/api/highscores");
  expect(result.ok()).toBeTruthy();
});

test("post endpoint should successfully save a highscore", async ({
  request,
}) => {
  const result = await request.post("/api/highscores", {
    data: {
      score: 100,
      username: "test",
      gameHistory: "this is some game history " + randomUUID(),
    },
  });
  expect(result.ok()).toBeTruthy();
  const getResponse = await request.get("/api/highscores");
    const body = await getResponse.json();
    expect(body.items).toContainEqual(
      expect.objectContaining({ score: 100, username: "test" }),
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

test("preventing submitting the same game history twice", async ({
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
