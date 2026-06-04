import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with default type=button', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('renders with type=submit when specified', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('variants', () => {
    it('applies primary variant by default', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole('button').className).toContain('bg-primary');
    });

    it('applies danger variant classes', () => {
      render(<Button variant="danger">Delete</Button>);
      expect(screen.getByRole('button').className).toContain('bg-danger');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button').className).toContain('bg-elevated');
    });
  });

  describe('loading state', () => {
    it('shows "Loading..." text when loading', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Loading...');
    });

    it('is disabled when loading', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when loading', () => {
      const onClick = vi.fn();
      render(<Button loading onClick={onClick}>Save</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is set', () => {
      render(<Button disabled>Can't click</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onClick handler on click', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('className prop', () => {
    it('merges additional className', () => {
      render(<Button className="my-custom-class">Test</Button>);
      expect(screen.getByRole('button').className).toContain('my-custom-class');
    });
  });
});
