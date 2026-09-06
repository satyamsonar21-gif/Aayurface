import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from './Logo';

describe('Logo Component', () => {
  it('renders the Aayurface text by default', () => {
    render(<Logo />);
    expect(screen.getByText('Aayurface')).toBeInTheDocument();
  });

  it('hides the text when variant is icon-only', () => {
    render(<Logo variant="icon-only" />);
    expect(screen.queryByText('Aayurface')).not.toBeInTheDocument();
  });
});
