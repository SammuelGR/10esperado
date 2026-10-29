import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AccountPage from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('./UsernameForm', () => ({
  default: () => <div data-testid="username-form-mock" />,
}));

vi.mock('./PasswordForm', () => ({
  default: () => <div data-testid="password-form-mock" />,
}));

vi.mock('./DeactivateAccountSection', () => ({
  default: () => <div data-testid="deactivate-account-section-mock" />,
}));

describe('AccountPage', () => {
  it('renders page content correctly', () => {
    render(<AccountPage />);

    expect(screen.getByText('content.header.title')).toBeVisible();
    expect(screen.getByText('content.header.description')).toBeVisible();
    expect(screen.getByTestId('username-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('password-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('deactivate-account-section-mock')).toBeInTheDocument();
  });
});
