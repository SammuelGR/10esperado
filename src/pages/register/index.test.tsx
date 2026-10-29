import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/test/render';

import RegisterPage from './index';

vi.mock('./RegisterForm', () => ({
  default: () => <div data-testid="register-form-mock" />,
}));

describe('RegisterPage', () => {
  it('renders page content correctly', () => {
    renderWithRouter(<RegisterPage />);

    expect(screen.getByText('content.header.title')).toBeVisible();
    expect(screen.getByText('content.header.description')).toBeVisible();
    expect(screen.getByTestId('register-form-mock')).toBeInTheDocument();
    expect(screen.getByText('content.footer.description')).toBeVisible();

    const loginLink = screen.getByRole('link', { name: 'content.footer.login' });

    expect(loginLink).toBeVisible();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
