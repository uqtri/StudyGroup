/**
 * E2E test data factories — generate realistic data for Playwright tests.
 * Uses timestamps to ensure uniqueness across runs.
 */

const ts = Date.now();

export const testUsers = {
  student: {
    fullName: 'Test Student',
    email: 'student@studyhub.com',
    password: 'Password123!',
  },
  leader: {
    fullName: 'Test Leader',
    email: 'leader@studyhub.com',
    password: 'Password123!',
  },
  admin: {
    fullName: 'Test Admin',
    email: 'admin@studyhub.com',
    password: 'Password123!',
  },
};

export const newUser = (suffix = ts) => ({
  fullName: `E2E User ${suffix}`,
  email: `e2e.user.${suffix}@example.com`,
  password: 'E2eTest123!',
});

export const newGroup = (suffix = ts) => ({
  name: `E2E Group ${suffix}`,
  description: 'Automated test group created by Playwright.',
  subject: 'Computer Science',
});

export const newSession = (suffix = ts) => ({
  title: `E2E Session ${suffix}`,
  description: 'Automated test session.',
});

export const newResource = (suffix = ts) => ({
  title: `E2E Resource ${suffix}`,
});
