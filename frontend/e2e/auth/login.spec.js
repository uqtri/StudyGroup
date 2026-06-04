import { test, expect } from '@playwright/test';
import { testUsers, newUser } from '../fixtures/factories';
import { loginAs, logout } from '../fixtures/helpers';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page);
    await page.goto('/login');
  });

  test.describe('Page rendering', () => {
    test('shows login heading and subtitle', async ({ page }) => {
      await expect(page.getByText(/welcome back/i)).toBeVisible();
      await expect(page.getByText(/sign in to your studyhub account/i)).toBeVisible();
    });

    test('shows email and password fields', async ({ page }) => {
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('shows sign in button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('has link to register page', async ({ page }) => {
      await page.getByRole('link', { name: /register/i }).click();
      await expect(page).toHaveURL('/register');
    });
  });

  test.describe('Validation', () => {
    test('shows error for invalid email format', async ({ page }) => {
      await page.getByLabel(/email/i).fill('not-an-email');
      await page.getByLabel(/password/i).fill('anypassword');
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page.getByText(/valid email required/i)).toBeVisible();
    });

    test('shows error for empty form submission', async ({ page }) => {
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page.getByText(/valid email required/i)).toBeVisible();
    });
  });

  test.describe('Successful login', () => {
    test('student can log in and see their dashboard', async ({ page }) => {
      await loginAs(page, testUsers.student);
      // Student lands on home or my-groups
      await expect(page).not.toHaveURL('/login');
    });

    test('admin is redirected to /admin/dashboard after login', async ({ page }) => {
      await loginAs(page, testUsers.admin);
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('session persists after page reload', async ({ page }) => {
      await loginAs(page, testUsers.student);
      await page.reload();
      // Should still be authenticated — not redirected to login
      await expect(page).not.toHaveURL('/login');
    });
  });

  test.describe('Failed login', () => {
    test('shows error for wrong password', async ({ page }) => {
      await page.getByLabel(/email/i).fill(testUsers.student.email);
      await page.getByLabel(/password/i).fill('WrongPassword1!');
      await page.getByRole('button', { name: /sign in/i }).click();
      // Error message from API
      await expect(page.locator('.text-danger')).toBeVisible({ timeout: 8_000 });
    });

    test('shows error for non-existent email', async ({ page }) => {
      await page.getByLabel(/email/i).fill('nonexistent@example.com');
      await page.getByLabel(/password/i).fill('Password123!');
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page.locator('.text-danger')).toBeVisible({ timeout: 8_000 });
    });
  });

  test.describe('Logout', () => {
    test('logging out clears session and redirects to home or login', async ({ page }) => {
      await loginAs(page, testUsers.student);
      // Clear auth state (simulates logout)
      await logout(page);
      await page.goto('/my-groups');
      await expect(page).toHaveURL('/login');
    });
  });
});
