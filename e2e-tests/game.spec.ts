import { test, expect, Page } from "@playwright/test";

const isMac = process.platform === "darwin";

test("when page is loaded, initially show start view", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome to Typo Terminator!")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Game" })).toBeVisible();
});

test("when played through first level, show level results", async ({
  page,
}) => {
  await page.goto("/");
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
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.getByText("Level 1")).toBeVisible();
  for (const key of level1FailKeys) {
    await pressGameKey(page, key);
  }
  await expect(page.getByText("Level 1 Failed")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Restart Game" })
  ).toBeVisible();
  for (const text of ["Germs: 0/69", "Animals: 2/44", "Difficulty: 100"]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(extractPoints(page)).resolves.toBe(0);

  // when pressing restart game, should go back to start view
  await page.getByRole("button", { name: "Restart Game" }).click();
  await expect(page.getByText("Welcome to Typo Terminator!")).toBeVisible();
});

test("when played through the game, show finished game view and calculate total points correctly", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'TODO: Still working on it');
  await page.goto("/");
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
    } else {
      await expect(page.getByText(`Level ${i + 1} Completed`)).toBeVisible();
    }
    totalPoints += await extractPoints(page);
    await expect(page.getByText("Total Points: " + totalPoints)).toBeVisible();
    if (!isLastLevel) {
      await page.getByRole("button", { name: "Next Level" }).click();
    }
  }
});
test("when played through last level with too many mistakes, show level failed message", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'TODO: Still working on it');
  await page.goto("/");
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
        page.getByText(`Level ${i + 1} Completed`)
      ).not.toBeVisible();
    } else {
      await expect(page.getByText(`Level ${i + 1} Completed`)).toBeVisible();
      await page.getByRole("button", { name: "Next Level" }).click();
    }
  }
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
  const points = await page.getByText(pointsRegex, { exact: true }).all();
  if (points.length === 0) {
    throw new Error("Points not found on page");
  }
  const pointsText = await points[points.length - 1].textContent();
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

const keysByLevel = [
  [
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
  ],
  [
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+Backspace",
  ],
  [
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
  ],
  [
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowLeft",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowLeft",
    "Delete",
    "Delete",
    "ArrowRight",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "Delete",
    "Delete",
    "Control+ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Delete",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
  ],
  [
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Control+ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+Backspace",
    "Control+Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "Control+ArrowRight",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Control+Backspace",
    "Control+ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Backspace",
    "ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Backspace",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Control+Backspace",
    "Control+Backspace",
    "ArrowLeft",
    "ArrowLeft",
    "Backspace",
    "ArrowLeft",
    "Backspace",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+Delete",
    "Control+Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Delete",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Delete",
    "Control+Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "Delete",
    "ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "ArrowRight",
    "ArrowRight",
    "ArrowLeft",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "Delete",
    "ArrowRight",
    "Delete",
    "Delete",
    "Control+Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "Control+Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+Delete",
    "Control+Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Control+Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Control+ArrowRight",
    "Control+ArrowRight",
    "Control+ArrowLeft",
    "Delete",
    "Delete",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "ArrowRight",
    "Delete",
    "Control+Delete",
  ],
];

const level1FailKeys = [
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+ArrowRight",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
];

const level5FailKeys = [
  "Delete",
  "Delete",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Delete",
  "Control+Backspace",
  "Backspace",
  "Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowLeft",
  "Delete",
  "Delete",
  "Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "Control+Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowRight",
  "Backspace",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "Backspace",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowLeft",
  "Control+Backspace",
  "ArrowLeft",
  "ArrowLeft",
  "Backspace",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Backspace",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Control+Backspace",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowRight",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "ArrowRight",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "Control+Backspace",
  "ArrowLeft",
  "ArrowLeft",
  "Backspace",
  "ArrowLeft",
  "Backspace",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Backspace",
  "Control+Delete",
  "Control+Delete",
  "Control+Backspace",
  "ArrowRight",
  "ArrowRight",
  "ArrowLeft",
  "Delete",
  "Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Backspace",
  "Delete",
  "ArrowRight",
  "Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "ArrowRight",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Control+Delete",
  "Control+Backspace",
  "Control+Delete",
  "Control+Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "Delete",
  "Control+Delete",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "ArrowRight",
  "Control+Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Control+Delete",
  "Control+Delete",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "ArrowLeft",
  "Delete",
  "Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "ArrowRight",
  "Control+Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Control+Delete",
  "Control+Backspace",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
  "Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "Control+Delete",
  "Control+Backspace",
  "Control+Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "ArrowLeft",
  "Control+Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Backspace",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "ArrowLeft",
  "Control+Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Backspace",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Control+Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "Control+Delete",
  "Control+Delete",
  "Control+Backspace",
  "Delete",
  "Delete",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "Delete",
  "ArrowRight",
  "ArrowRight",
  "ArrowLeft",
  "Delete",
  "ArrowRight",
  "Delete",
  "Delete",
  "Delete",
];
