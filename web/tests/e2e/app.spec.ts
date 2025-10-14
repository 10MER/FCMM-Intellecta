import { test, expect } from '@playwright/test';

// These are smoke tests; requires running app and a configured Supabase project

test('landing has CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Get Access' })).toBeVisible();
});
