import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/factories';
import { loginAs, logout } from '../fixtures/helpers';

test.describe('Sessions', () => {
  test.describe('Sessions list page', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.student);
    });

    test('sessions page loads when authenticated', async ({ page }) => {
      await page.goto('/sessions');
      await expect(page).toHaveURL('/sessions');
    });

    test('sessions page renders without error', async ({ page }) => {
      await page.goto('/sessions');
      await page.waitForLoadState('networkidle');
      // No error boundary message
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });
  });

  test.describe('Session detail page', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.student);
    });

    test('navigating to a session detail loads the page', async ({ page }) => {
      await page.goto('/sessions');
      await page.waitForLoadState('networkidle');

      const sessionLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const href = await sessionLink.getAttribute('href');

      if (href && href.match(/^\/sessions\/[^/]+$/)) {
        await page.goto(href);
        await expect(page).toHaveURL(href);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Access control', () => {
    test('redirects unauthenticated user from /sessions to /login', async ({ page }) => {
      await logout(page);
      await page.goto('/sessions');
      await expect(page).toHaveURL('/login');
    });

    test('redirects admin user from /sessions to admin portal', async ({ page }) => {
      await loginAs(page, testUsers.admin);
      await page.goto('/sessions');
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Admin sessions management', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('/admin/sessions page loads for admin', async ({ page }) => {
      await page.goto('/admin/sessions');
      await expect(page).toHaveURL('/admin/sessions');
    });

    test('admin sessions page renders without error', async ({ page }) => {
      await page.goto('/admin/sessions');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });
  });
});
