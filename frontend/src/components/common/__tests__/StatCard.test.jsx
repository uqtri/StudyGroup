import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';
import { Users } from 'lucide-react';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Users" value={42} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders trend when provided', () => {
    render(<StatCard label="Growth" value="15%" trend="+5% this month" />);
    expect(screen.getByText('+5% this month')).toBeInTheDocument();
  });

  it('does not render trend element when not provided', () => {
    const { container } = render(<StatCard label="Count" value={10} />);
    // No .text-success element rendered
    expect(container.querySelector('.text-success')).toBeNull();
  });

  it('renders icon when provided', () => {
    const { container } = render(<StatCard label="Users" value={5} icon={Users} />);
    // lucide-react renders an svg
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render icon container when icon is not provided', () => {
    const { container } = render(<StatCard label="Count" value={0} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});
