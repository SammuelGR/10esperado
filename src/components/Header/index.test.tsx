import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { renderWithRouter } from '@/test/render';
import type { User } from '@/types/user';

import Header from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('./UserMenu', () => ({
  default: () => <div data-testid="user-menu-mock" />,
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

describe('Header', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ user: null, login: vi.fn(), logout: vi.fn() });
  });

  it('renders the logo and public links for guests on the root route', () => {
    renderWithRouter(<Header />);

    expect(screen.getByText('content.header.logo.prefix')).toBeVisible();
    expect(screen.getByText('content.header.logo.name')).toBeVisible();
    expect(screen.getByRole('link', { name: /content.header.logo.prefix/ })).toHaveAttribute('href', '/');

    const loginLink = screen.getByRole('link', { name: 'content.header.actions.login' });
    const registerLink = screen.getByRole('link', { name: 'content.header.actions.register' });

    expect(loginLink).toBeVisible();
    expect(loginLink).toHaveAttribute('href', '/login');
    expect(registerLink).toBeVisible();
    expect(registerLink).toHaveAttribute('href', '/register');
    expect(screen.queryByTestId('user-menu-mock')).not.toBeInTheDocument();
  });

  it('shows the registration link and hides the login link on the login route', () => {
    renderWithRouter(<Header />, { initialLocation: '/login' });

    expect(screen.getByRole('link', { name: 'content.header.actions.register' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'content.header.actions.login' })).not.toBeInTheDocument();
  });

  it('shows the login link and hides the registration link on the registration route', () => {
    renderWithRouter(<Header />, { initialLocation: '/register' });

    expect(screen.getByRole('link', { name: 'content.header.actions.login' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'content.header.actions.register' })).not.toBeInTheDocument();
  });

  it('shows the user menu and hides public links for authenticated users', () => {
    vi.mocked(useAuth).mockReturnValue({ user: fakeUser, login: vi.fn(), logout: vi.fn() });

    renderWithRouter(<Header />);

    expect(screen.getByTestId('user-menu-mock')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'content.header.actions.login' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'content.header.actions.register' })).not.toBeInTheDocument();
  });
});
