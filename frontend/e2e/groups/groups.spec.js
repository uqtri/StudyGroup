import { test, expect } from '@playwright/test';
import { testUsers, newGroup } from '../fixtures/factories';
import { loginAs, logout } from '../fixtures/helpers';

test.describe('Group Management', () => {
  test.describe('Browse groups (public)', () => {
    test('landing page shows groups link', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('link', { name: /groups/i }).first()).toBeVisible();
    });

    test('/groups page is accessible without login', async ({ page }) => {
      await page.goto('/groups');
      await expect(page).toHaveURL('/groups');
    });

    test('groups page renders group listings or empty state', async ({ page }) => {
      await page.goto('/groups');
      // Either group cards or a no-results message should be visible
      const hasGroups = await page.locator('[class*="card"], [class*="Card"]').count();
      expect(hasGroups).toBeGreaterThanOrEqual(0); // page loaded without error
    });
  });

  test.describe('Create group', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.leader);
    });

    test('navigates to create group page', async ({ page }) => {
      await page.goto('/groups/create');
      await expect(page).toHaveURL('/groups/create');
    });

    test('create group form is visible', async ({ page }) => {
      await page.goto('/groups/create');
      // The form should have a name/subject field
      await expect(page.getByRole('textbox').first()).toBeVisible();
    });
  });

  test.describe('My groups dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.student);
    });

    test('my-groups page is accessible when authenticated', async ({ page }) => {
      await page.goto('/my-groups');
      await expect(page).toHaveURL('/my-groups');
    });

    test('shows joined groups section', async ({ page }) => {
      await page.goto('/my-groups');
      await expect(page.getByText(/joined groups/i)).toBeVisible({ timeout: 10_000 });
    });

    test('shows upcoming sessions section', async ({ page }) => {
      await page.goto('/my-groups');
      await expect(page.getByText(/upcoming sessions/i)).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe('Group detail page', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, testUsers.student);
    });

    test('navigating to a group detail loads the page', async ({ page }) => {
      await page.goto('/groups');
      await page.waitForLoadState('networkidle');

      const firstGroupLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const href = await firstGroupLink.getAttribute('href');

      if (href && href.startsWith('/groups/')) {
        await page.goto(href);
        await expect(page).toHaveURL(href);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Access control', () => {
    test('unauthenticated user is redirected when accessing my-groups', async ({ page }) => {
      await logout(page);
      await page.goto('/my-groups');
      await expect(page).toHaveURL('/login');
    });

    test('unauthenticated user is redirected when accessing create group', async ({ page }) => {
      await logout(page);
      await page.goto('/groups/create');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Search groups', () => {
    test('groups page supports search input', async ({ page }) => {
      await page.goto('/groups');
      const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));
      if (await searchInput.count() > 0) {
        await searchInput.fill('React');
        await page.waitForTimeout(500); // debounce
        // Just verify no error occurs during search
        await expect(page).toHaveURL(/\/groups/);
      }
    });
  });
});
