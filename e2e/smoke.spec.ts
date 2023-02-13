import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('App loads and shows login page', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForURL('/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(
    page.getByRole('heading', { level: 1, name: /Sign.?in/i })
  ).toBeVisible();

  // analyzes the page with axe
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const { violations } = accessibilityScanResults;
  // attaches the violations to the test report
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });

  violations.forEach(function (entry) {
    console.log(`${entry.impact} ${entry.description}`);
  });

  expect(violations).toEqual([]);
});
