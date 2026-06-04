import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><span>Content</span></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Group Overview">Content</Card>);
    expect(screen.getByText('Group Overview')).toBeInTheDocument();
  });

  it('does not render title header when neither title nor action given', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector('h3')).toBeNull();
  });

  it('renders action element alongside title', () => {
    render(
      <Card title="My Card" action={<button>Edit</button>}>
        Body
      </Card>,
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<Card className="custom-class">x</Card>);
    expect(container.firstChild.className).toContain('custom-class');
  });
});
