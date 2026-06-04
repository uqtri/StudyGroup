import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders an input element', () => {
      render(<Input name="email" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input label="Email" name="email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<Input name="email" />);
      expect(screen.queryByRole('label')).toBeNull();
    });

    it('associates label with input via htmlFor', () => {
      render(<Input label="Email" name="email" />);
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');
    });
  });

  describe('error state', () => {
    it('shows error message when error prop is set', () => {
      render(<Input label="Email" name="email" error="Email is required" />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('applies error styling to input', () => {
      render(<Input name="email" error="Required" />);
      expect(screen.getByRole('textbox').className).toContain('border-danger');
    });

    it('hides helper text when error is present', () => {
      render(<Input name="email" helper="Enter your email" error="Required" />);
      expect(screen.queryByText('Enter your email')).toBeNull();
    });
  });

  describe('helper text', () => {
    it('shows helper when no error', () => {
      render(<Input name="email" helper="We will never share your email." />);
      expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
    });
  });

  describe('props forwarding', () => {
    it('passes type prop to input', () => {
      render(<Input name="pwd" type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    });

    it('calls onChange handler', () => {
      const onChange = vi.fn();
      render(<Input name="email" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('forwards placeholder', () => {
      render(<Input name="email" placeholder="you@example.com" />);
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });
  });
});
