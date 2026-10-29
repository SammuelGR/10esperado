import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/test/render';

import LoginPage from './index';

vi.mock('./LoginForm', () => ({
  default: () => <div data-testid="login-form-mock" />,
}));

describe('LoginPage', () => {
  it('renders page content correctly', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByText('content.header.title')).toBeVisible();
    expect(screen.getByText('content.header.description')).toBeVisible();
    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument();
    expect(screen.getByText('content.footer.description')).toBeVisible();

    const registerLink = screen.getByRole('link', { name: 'content.footer.register' });

    expect(registerLink).toBeVisible();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
