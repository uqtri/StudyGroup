import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  describe('with image src', () => {
    it('renders an img element', () => {
      render(<Avatar src="https://example.com/photo.jpg" name="Alice Smith" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('sets alt to name', () => {
      render(<Avatar src="https://example.com/photo.jpg" name="Alice Smith" />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Alice Smith');
    });
  });

  describe('without image src — initials fallback', () => {
    it('shows initials for two-word name', () => {
      render(<Avatar name="Alice Smith" />);
      expect(screen.getByText('AS')).toBeInTheDocument();
    });

    it('shows first two chars for single-word name', () => {
      render(<Avatar name="Alice" />);
      expect(screen.getByText('AL')).toBeInTheDocument();
    });

    it('shows "?" for empty name', () => {
      render(<Avatar name="" />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('shows "?" when name is not provided', () => {
      render(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('uses the first and last word initials for multi-word name', () => {
      render(<Avatar name="John Michael Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies sm size class by default', () => {
      const { container } = render(<Avatar name="Alice" />);
      expect(container.firstChild.className).toContain('h-8');
    });

    it('applies md size class', () => {
      const { container } = render(<Avatar name="Alice" size="md" />);
      expect(container.firstChild.className).toContain('h-9');
    });
  });
});
