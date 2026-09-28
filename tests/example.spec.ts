import { test, expect } from '@playwright/test';

const testUrl = 'http://localhost:5173/';
const testTitle = 'birdman-ui';

test('has title', async ({ page }) => {
  await page.goto(testUrl);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(testTitle);
});

