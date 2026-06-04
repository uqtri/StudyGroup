/**
 * Shared Playwright helper functions for E2E tests.
 */

/**
 * Log in via the UI and wait for redirect.
 */
export async function loginAs(page, { email, password }) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  // Wait until we leave the login page
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10_000 });
}

/**
 * Log out via clearing local storage (fast logout without UI).
 */
export async function logout(page) {
  await page.evaluate(() => {
    localStorage.removeItem('studyhub-auth');
  });
  await page.goto('/');
}

/**
 * Wait for a toast or alert message matching text.
 */
export async function waitForMessage(page, text) {
  await page.waitForSelector(`text=${text}`, { timeout: 8_000 });
}
