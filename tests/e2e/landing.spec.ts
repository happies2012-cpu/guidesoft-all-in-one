import { expect, test } from '@playwright/test';

test('landing page renders primary brand actions', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/GUIDESOFT/i);
  await expect(page.getByRole('heading', { name: /One Platform/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Start Building Free/i }).first()).toBeVisible();
  await expect(page.getByText(/Design and Developed by GUIDESOFT/i)).toBeVisible();
});

test('auth page renders login and signup panels', async ({ page }) => {
  await page.goto('/auth');

  await expect(page.getByRole('tab', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Sign Up' })).toBeVisible();
  await expect(page.locator('#login-email')).toBeVisible();
});

test('unknown routes fall back to not found screen', async ({ page }) => {
  await page.goto('/does-not-exist');

  await expect(page.getByText(/404/i)).toBeVisible();
});
