import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../authSchemas';

describe('loginSchema', () => {
  const valid = { email: 'user@example.com', password: 'any' };

  it('accepts valid credentials', () => {
    expect(() => loginSchema.parse(valid)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/email/i);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ ...valid, password: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({ password: 'pass' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = { fullName: 'Alice Smith', email: 'alice@example.com', password: 'Password1' };

  it('accepts valid registration data', () => {
    expect(() => registerSchema.parse(valid)).not.toThrow();
  });

  it('rejects fullName shorter than 2 chars', () => {
    const result = registerSchema.safeParse({ ...valid, fullName: 'A' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/2 character/i);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'bad-email' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 chars', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Pass1' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/8 character/i);
  });

  it('rejects password without uppercase letter', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'password1' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/uppercase/i);
  });

  it('rejects password without a number', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'PasswordABC' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/number/i);
  });
});
