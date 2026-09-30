import { test, expect } from '@playwright/test';

const testTitle = 'birdman-ui';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(testTitle);
});
