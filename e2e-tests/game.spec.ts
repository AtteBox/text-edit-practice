import { test, expect, Page } from "@playwright/test";
import { keysByLevel, level1FailKeys, level5FailKeys } from "./keySequences";

const isMac = process.platform === "darwin";

test("when page is loaded, initially show start view", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome to Typo Terminator!")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Game" })).toBeVisible();
});

test("when invalid username is entered, show error message", async ({
  page,
}) => {
  await page.goto("/");
  for (const { input, message } of [
    { input: "", message: "Username must be at least 2 characters." },
    {
      input: "a".repeat(21),
      message: "Username must be at most 20 characters.",
    },
    {
      input: "123",
      message:
        "Must consist of letters, digits and spaces. At least one letter. Consecutive spaces are not allowed.",
    },
    {
      input: "a  b",
      message:
        "Must consist of letters, digits and spaces. At least one letter. Consecutive spaces are not allowed.",
    },
    {
      input: "**",
      message:
        "Must consist of letters, digits and spaces. At least one letter. Consecutive spaces are not allowed.",
    },
  ]) {
    await page.fill("input", input);
    await page.getByRole("button", { name: "Start Game" }).click();
    await expect(page.getByText(message)).toBeVisible();
  }
});

test("when played through first level, show level results", async ({
  page,
}) => {
  await page.goto("/");
  await page.fill("input", "Test User");
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.getByText("Level 1")).toBeVisible();
  for (const key of keysByLevel[0]) {
    await pressGameKey(page, key);
  }
  await expect(page.getByText("Level 1 Completed")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next Level" })).toBeVisible();
  for (const text of ["Germs: 0/69", "Animals: 44/44", "Difficulty: 100"]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  // points nor time should not change after level completion
  const points = await extractPoints(page);
  const time = await extractTime(page);
  await page.waitForTimeout(2000);
  await expect(extractPoints(page)).resolves.toBe(points);
  await expect(extractTime(page)).resolves.toBe(time);

  await expect(points).toBeGreaterThanOrEqual(0);
  await expect(points).toBeLessThanOrEqual(200);
  await expect(time).toBeGreaterThanOrEqual(0);
  await expect(time).toBeLessThanOrEqual(100);
});

test("when played through first level with too many mistakes, show level failed message", async ({
  page,
}) => {
  await page.goto("/");
  await page.fill("input", "Test User");
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.getByText("Level 1")).toBeVisible();
  for (const key of level1FailKeys) {
    await pressGameKey(page, key);
  }
  await expect(page.getByText("Level 1 Failed")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Restart Game" }),
  ).toBeVisible();
  for (const text of ["Germs: 0/69", "Animals: 2/44", "Difficulty: 100"]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(extractPoints(page)).resolves.toBe(0);

  // when pressing restart game, should go back to start view
  await page.getByRole("button", { name: "Restart Game" }).click();
  await expect(page.getByText("Welcome to Typo Terminator!")).toBeVisible();
});

test("when played through last level with too many mistakes, show level failed message", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", "TODO: Still working on it");
  await page.goto("/");
  await page.fill("input", "Test User");
  await page.getByRole("button", { name: "Start Game" }).click();
  for (let i = 0; i < keysByLevel.length; i++) {
    const isLastLevel = i === keysByLevel.length - 1;
    const levelKeys = isLastLevel ? level5FailKeys : keysByLevel[i];
    await expect(page.getByText(`Level ${i + 1}`)).toBeVisible();
    for (const key of levelKeys) {
      await pressGameKey(page, key);
    }
    if (isLastLevel) {
      await expect(page.getByText(`Level ${i + 1} Failed`)).toBeVisible();
      await expect(
        page.getByText(`Level ${i + 1} Completed`),
      ).not.toBeVisible();
    } else {
      await expect(page.getByText(`Level ${i + 1} Completed`)).toBeVisible();
      await page.getByRole("button", { name: "Next Level" }).click();
    }
  }
});

test("when played through the game, show finished game view and calculate total points correctly. Also persist history to db", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", "TODO: Still working on it");
  await page.goto("/");
  await page.fill("input", "Test User");
  await page.getByRole("button", { name: "Start Game" }).click();
  let totalPoints = 0;
  for (let i = 0; i < keysByLevel.length; i++) {
    const isLastLevel = i === keysByLevel.length - 1;
    await expect(page.getByText(`Level ${i + 1}`)).toBeVisible();
    // points should be zero at the beginning of each level
    await expect(extractPoints(page)).resolves.toBe(0);
    for (const key of keysByLevel[i]) {
      await pressGameKey(page, key);
    }
    if (isLastLevel) {
      await expect(page.getByText(`Congratulations!`)).toBeVisible();
      await expect(page.getByText("Time:", { exact: false }), "should have finished and recorded 5 levels").toHaveCount(5);
    } else {
      await expect(page.getByText(`Level ${i + 1} Completed`)).toBeVisible();
    }
    totalPoints += await extractPoints(page);
    await expect(page.getByText("Total Points: " + totalPoints)).toBeVisible();
    if (!isLastLevel) {
      await page.getByRole("button", { name: "Next Level" }).click();
    } else {
      await page.getByRole("link", { name: "top 100 highscores", exact: false }).click();
      await expect(page.getByText("top 100 highscores", { exact: false })).toBeVisible();
    }
  }
});

test("when playing a level, user can pause and resume the game", async ({
  page,
}) => {
  await page.goto("/");
  await page.fill("input", "Test User");
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.getByText("Level 1")).toBeVisible();
  
  // Play a few keys to start the game
  const initialKeys = keysByLevel[0].slice(0, 5);
  for (const key of initialKeys) {
    await pressGameKey(page, key);
  }
  
  // Record points and time before pausing
  const pointsBeforePause = await extractPoints(page);
  const timeBeforePause = await extractTime(page);
  
  // Pause the game
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByText("Game Paused")).toBeVisible();
  
  // Wait a moment to ensure time would have advanced if not paused
  await page.waitForTimeout(1000);
  
  // Verify points and time are frozen while paused
  await expect(extractPoints(page)).resolves.toBe(pointsBeforePause);
  await expect(extractTime(page)).resolves.toBe(timeBeforePause);
  
  // Resume the game
  await page.getByRole("button", { name: "Resume Game" }).click();
  await expect(page.getByText("Game Paused")).not.toBeVisible();

  // Wait a moment to allow time to advance
  await page.waitForTimeout(1000);

  // time should be higher than before pause
  const finalTime = await extractTime(page);
  expect(finalTime).toBeGreaterThan(timeBeforePause);
  
  // Continue playing
  const remainingKeys = keysByLevel[0].slice(5);
  for (const key of remainingKeys) {
    await pressGameKey(page, key);
  }
  
  // Verify level completed
  await expect(page.getByText("Level 1 Completed")).toBeVisible();
  
  // Final points should be higher than before pause
  const finalPoints = await extractPoints(page);
  expect(finalPoints).toBeGreaterThan(pointsBeforePause);

});

/**
 * Presses a key in the game textarea
 * @param gameElement
 * @param key key to press
 */
async function pressGameKey(page: Page, key: string) {
  await page.keyboard.press(isMac ? key.replace("Control", "Alt") : key);
}

/**
 * Extracts points from the last "Points: " text on the page
 * @param page
 * @returns points as integer
 */
async function extractPoints(page: Page) {
  const pointsRegex = /^Points: ([0-9]+)/;
  const pointsHits = await page.getByText(pointsRegex, { exact: true }).all();
  if (pointsHits.length === 0) {
    throw new Error("Points not found on page");
  }
  const pointsText = await pointsHits[pointsHits.length - 1].textContent();
  const match = pointsText!.match(pointsRegex);
  return Number(match![1]);
}

/** Extracts time from the last "Time: " text on the page
 * @param page
 * @returns time as integer
 * */
async function extractTime(page: Page) {
  const timeRegex = /^Time: ([0-9]+)\//;
  const time = await page.getByText(timeRegex, { exact: true });
  const timeText = await time.textContent();
  const match = timeText!.match(timeRegex);
  return Number(match![1]);
}
