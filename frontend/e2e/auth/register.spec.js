import { test, expect } from '@playwright/test';
import { newUser } from '../fixtures/factories';
import { logout } from '../fixtures/helpers';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page);
    await page.goto('/register');
  });

  test.describe('Page rendering', () => {
    test('shows create account heading', async ({ page }) => {
      await expect(page.getByText(/create account/i)).toBeVisible();
    });

    test('shows full name, email, password fields', async ({ page }) => {
      await expect(page.getByLabel(/full name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('has link back to login', async ({ page }) => {
      await page.getByRole('link', { name: /sign in/i }).click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Validation', () => {
    test('shows error for short full name', async ({ page }) => {
      await page.getByLabel(/full name/i).fill('A');
      await page.getByLabel(/email/i).fill('a@b.com');
      await page.getByLabel(/password/i).fill('Password1');
      await page.getByRole('button', { name: /register/i }).click();
      await expect(page.getByText(/2 character/i)).toBeVisible();
    });

    test('shows error for invalid email', async ({ page }) => {
      await page.getByLabel(/full name/i).fill('Alice Smith');
      await page.getByLabel(/email/i).fill('bad-email');
      await page.getByLabel(/password/i).fill('Password1');
      await page.getByRole('button', { name: /register/i }).click();
      await expect(page.getByText(/valid email required/i)).toBeVisible();
    });

    test('shows error for password without uppercase', async ({ page }) => {
      await page.getByLabel(/full name/i).fill('Alice Smith');
      await page.getByLabel(/email/i).fill('alice@example.com');
      await page.getByLabel(/password/i).fill('password1');
      await page.getByRole('button', { name: /register/i }).click();
      await expect(page.getByText(/uppercase/i)).toBeVisible();
    });

    test('shows error for password without number', async ({ page }) => {
      await page.getByLabel(/full name/i).fill('Alice Smith');
      await page.getByLabel(/email/i).fill('alice@example.com');
      await page.getByLabel(/password/i).fill('PasswordABC');
      await page.getByRole('button', { name: /register/i }).click();
      await expect(page.getByText(/number/i)).toBeVisible();
    });

    test('shows error for password shorter than 8 chars', async ({ page }) => {
      await page.getByLabel(/full name/i).fill('Alice Smith');
      await page.getByLabel(/email/i).fill('alice@example.com');
      await page.getByLabel(/password/i).fill('Pass1');
      await page.getByRole('button', { name: /register/i }).click();
      await expect(page.getByText(/8 character/i)).toBeVisible();
    });
  });

  test.describe('Successful registration', () => {
    test('new user can register and is authenticated', async ({ page }) => {
      const user = newUser();

      await page.getByLabel(/full name/i).fill(user.fullName);
      await page.getByLabel(/email/i).fill(user.email);
      await page.getByLabel(/password/i).fill(user.password);
      await page.getByRole('button', { name: /register/i }).click();

      // Should leave register page after success
      await expect(page).not.toHaveURL('/register', { timeout: 10_000 });
    });
  });

  test.describe('Duplicate email', () => {
    test('shows error when email is already registered', async ({ page }) => {
      // Use a known existing account
      await page.getByLabel(/full name/i).fill('Existing User');
      await page.getByLabel(/email/i).fill('student@studyhub.com');
      await page.getByLabel(/password/i).fill('Password123!');
      await page.getByRole('button', { name: /register/i }).click();
      await expect(page.locator('.text-danger')).toBeVisible({ timeout: 8_000 });
    });
  });
});
