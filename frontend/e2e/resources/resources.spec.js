import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/factories';
import { loginAs, logout } from '../fixtures/helpers';

test.describe('Resources', () => {
  test.describe('Resources list page', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.student);
    });

    test('/resources page loads when authenticated', async ({ page }) => {
      await page.goto('/resources');
      await expect(page).toHaveURL('/resources');
    });

    test('resources page renders without error', async ({ page }) => {
      await page.goto('/resources');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });
  });

  test.describe('Access control', () => {
    test('redirects unauthenticated user from /resources to /login', async ({ page }) => {
      await logout(page);
      await page.goto('/resources');
      await expect(page).toHaveURL('/login');
    });

    test('admin is redirected to admin portal when accessing /resources', async ({ page }) => {
      await loginAs(page, testUsers.admin);
      await page.goto('/resources');
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Admin resources management', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('/admin/resources page loads for admin', async ({ page }) => {
      await page.goto('/admin/resources');
      await expect(page).toHaveURL('/admin/resources');
    });

    test('admin resources page renders without error', async ({ page }) => {
      await page.goto('/admin/resources');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });
  });

  test.describe('Group resources tab (via group detail)', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.student);
    });

    test('group detail page renders resources tab', async ({ page }) => {
      await page.goto('/groups');
      await page.waitForLoadState('networkidle');

      const groupLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const href = await groupLink.getAttribute('href');

      if (href && href.startsWith('/groups/') && !href.includes('/manage')) {
        await page.goto(`${href}?tab=resources`);
        await page.waitForLoadState('networkidle');
        // Just verify the page loaded without crashing
        await expect(page.locator('text=Something went wrong')).not.toBeVisible();
      } else {
        test.skip();
      }
    });
  });
});
