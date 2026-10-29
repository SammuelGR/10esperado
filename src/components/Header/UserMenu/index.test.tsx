import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { renderWithRouter } from '@/test/render';
import type { User } from '@/types/user';

import UserMenu from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

const fakeLogout = vi.fn();

describe('UserMenu', () => {
  beforeEach(() => {
    fakeLogout.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ user: fakeUser, logout: fakeLogout });
  });

  it('renders user menu content correctly', () => {
    renderWithRouter(<UserMenu />);

    expect(screen.getByText(fakeUser.username)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'content.header.userMenu.label' })).toBeVisible();
    expect(screen.getByText('content.header.actions.logout')).toBeInTheDocument();

    const accountLink = screen.getByText('content.header.actions.account');

    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveAttribute('href', '/account');
  });

  it('logs out when the logout action is selected', () => {
    renderWithRouter(<UserMenu />);

    // jsdom does not implement opening native popovers.
    fireEvent.click(screen.getByText('content.header.actions.logout'));

    expect(fakeLogout).toHaveBeenCalledOnce();
  });

  it('renders nothing when there is no authenticated user', () => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ user: null });

    const { container } = renderWithRouter(<UserMenu />);

    expect(container).toBeEmptyDOMElement();
  });
});
