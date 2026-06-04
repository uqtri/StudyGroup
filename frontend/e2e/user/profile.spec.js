import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/factories';
import { loginAs, logout } from '../fixtures/helpers';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, testUsers.student);
    await page.goto('/profile');
  });

  test.describe('Page rendering', () => {
    test('shows Profile heading', async ({ page }) => {
      await expect(page.getByText('Profile')).toBeVisible({ timeout: 10_000 });
    });

    test('shows Personal Information card', async ({ page }) => {
      await expect(page.getByText(/personal information/i)).toBeVisible({ timeout: 10_000 });
    });

    test('shows stat cards: groups, attendance, resources', async ({ page }) => {
      await expect(page.getByText(/my groups/i)).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText(/attendance rate/i)).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText(/resources uploaded/i)).toBeVisible({ timeout: 10_000 });
    });

    test('shows user email', async ({ page }) => {
      await expect(page.getByText(testUsers.student.email)).toBeVisible({ timeout: 10_000 });
    });

    test('shows save changes button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /save changes/i })).toBeVisible({
        timeout: 10_000,
      });
    });
  });

  test.describe('Edit profile', () => {
    test('can update full name field', async ({ page }) => {
      await page.waitForSelector('input[name="fullName"]', { timeout: 10_000 });
      const nameInput = page.locator('input[name="fullName"]');
      await nameInput.clear();
      await nameInput.fill('Updated Test Name');
      await expect(nameInput).toHaveValue('Updated Test Name');
    });

    test('can update bio textarea', async ({ page }) => {
      await page.waitForSelector('textarea[name="bio"]', { timeout: 10_000 });
      const bio = page.locator('textarea[name="bio"]');
      await bio.clear();
      await bio.fill('My updated bio text.');
      await expect(bio).toHaveValue('My updated bio text.');
    });

    test('shows success message after saving profile', async ({ page }) => {
      await page.waitForSelector('input[name="fullName"]', { timeout: 10_000 });
      await page.getByRole('button', { name: /save changes/i }).click();
      await expect(page.getByText(/profile updated/i)).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe('Joined groups section', () => {
    test('shows joined groups card', async ({ page }) => {
      await expect(page.getByText(/joined groups/i)).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe('Access control', () => {
    test('redirects to login when not authenticated', async ({ page }) => {
      await logout(page);
      await page.goto('/profile');
      await expect(page).toHaveURL('/login');
    });
  });
});
