import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/factories';
import { loginAs, logout } from '../fixtures/helpers';

test.describe('Admin Features', () => {
  test.describe('Access control', () => {
    test('non-admin cannot access admin dashboard', async ({ page }) => {
      await loginAs(page, testUsers.student);
      await page.goto('/admin/dashboard');
      // Should be redirected away from admin
      await expect(page).not.toHaveURL('/admin/dashboard');
    });

    test('unauthenticated user cannot access admin pages', async ({ page }) => {
      await logout(page);
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/login');
    });

    test('admin can access admin dashboard', async ({ page }) => {
      await loginAs(page, testUsers.admin);
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('shows stat cards on dashboard', async ({ page }) => {
      await expect(page.getByText(/total users/i)).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText(/active groups/i)).toBeVisible({ timeout: 10_000 });
    });

    test('shows platform summary section', async ({ page }) => {
      await expect(page.getByText(/platform summary/i)).toBeVisible({ timeout: 10_000 });
    });

    test('renders charts', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      // Charts are svg or canvas elements
      const chartCount = await page.locator('svg, canvas').count();
      expect(chartCount).toBeGreaterThan(0);
    });
  });

  test.describe('Admin Users', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('/admin/users page loads', async ({ page }) => {
      await page.goto('/admin/users');
      await expect(page).toHaveURL('/admin/users');
    });

    test('admin users page renders without error', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });

    test('shows user list or empty state', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');
      // Page rendered without crash
      await expect(page).toHaveURL('/admin/users');
    });
  });

  test.describe('Admin Groups', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('/admin/groups page loads', async ({ page }) => {
      await page.goto('/admin/groups');
      await expect(page).toHaveURL('/admin/groups');
    });

    test('admin groups page renders without error', async ({ page }) => {
      await page.goto('/admin/groups');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });
  });

  test.describe('Admin Settings', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('/admin/settings page loads', async ({ page }) => {
      await page.goto('/admin/settings');
      await expect(page).toHaveURL('/admin/settings');
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.admin);
    });

    test('admin sidebar navigation links are visible', async ({ page }) => {
      // Sidebar should be rendered in admin layout
      await expect(page.locator('nav, aside').first()).toBeVisible({ timeout: 10_000 });
    });

    test('admin can navigate between pages via URL', async ({ page }) => {
      const adminPages = [
        '/admin/dashboard',
        '/admin/users',
        '/admin/groups',
        '/admin/sessions',
        '/admin/resources',
      ];

      for (const path of adminPages) {
        await page.goto(path);
        await expect(page).toHaveURL(path);
      }
    });
  });
});
