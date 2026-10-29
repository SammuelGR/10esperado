import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
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
    vi.mocked(useAuth).mockReturnValue({ user: fakeUser, login: vi.fn(), logout: fakeLogout });
  });

  it('renders user menu content correctly', () => {
    render(<UserMenu />);

    expect(screen.getByText(fakeUser.username)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'content.header.userMenu.label' })).toBeVisible();
    expect(screen.getByText('content.header.actions.logout')).toBeInTheDocument();
  });

  it('logs out when the logout action is selected', () => {
    render(<UserMenu />);

    // jsdom does not implement opening native popovers.
    fireEvent.click(screen.getByText('content.header.actions.logout'));

    expect(fakeLogout).toHaveBeenCalledOnce();
  });

  it('renders nothing when there is no authenticated user', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, login: vi.fn(), logout: fakeLogout });

    const { container } = render(<UserMenu />);

    expect(container).toBeEmptyDOMElement();
  });
});
