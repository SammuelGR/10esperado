import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import type { User } from '@/types/user';

import LoginForm from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

const fakeCredentials = {
  username: 'fake_user',
  password: 'FakePassword123!',
};

const fakeUser: User = {
  id: 'fake-user-id',
  username: fakeCredentials.username,
  status: 'active',
};

const fakeLogin = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    fakeLogin.mockReset();
    fakeLogin.mockResolvedValue({ success: true, user: fakeUser });
    vi.mocked(useAuth).mockReturnValue({ user: null, login: fakeLogin, logout: vi.fn() });
  });

  it('renders form content correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('form.username.label')).toHaveAttribute('placeholder', 'form.username.placeholder');
    expect(screen.getByLabelText('form.password.label')).toHaveAttribute('placeholder', 'form.password.placeholder');
    expect(screen.getByRole('button', { name: 'form.submit.label' })).toBeInTheDocument();
  });

  it('logs in with the submitted credentials', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    await waitFor(() => {
      expect(fakeLogin).toHaveBeenCalledExactlyOnceWith(fakeCredentials);
    });
  });

  it('shows required field errors when submitted empty', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByText('form.username.errors.required')).toBeVisible();
    expect(screen.getByText('form.password.errors.required')).toBeVisible();
    expect(screen.getByLabelText('form.username.label')).toHaveAccessibleDescription('form.username.errors.required');
    expect(screen.getByLabelText('form.password.label')).toHaveAccessibleDescription('form.password.errors.required');
    expect(fakeLogin).not.toHaveBeenCalled();
  });

  it('shows invalid credentials feedback', async () => {
    const user = userEvent.setup();

    fakeLogin.mockResolvedValue({ success: false, reason: 'invalidCredentials' });

    render(<LoginForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('form.submit.errors.invalidCredentials');
  });

  it('shows inactive account feedback', async () => {
    const user = userEvent.setup();

    fakeLogin.mockResolvedValue({ success: false, reason: 'inactiveAccount' });

    render(<LoginForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('form.submit.errors.inactiveAccount');
  });

  it('shows submission error when login throws', async () => {
    const user = userEvent.setup();

    fakeLogin.mockRejectedValue(new Error('Fake login error'));

    render(<LoginForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('form.submit.errors.failed');
  });

  it('shows loading and disables the controls while login is pending', async () => {
    const user = userEvent.setup();

    fakeLogin.mockReturnValue(new Promise(() => {}));

    render(<LoginForm />);

    expect(screen.getByText('form.submit.label')).toBeVisible();
    expect(screen.queryByText('form.submit.loading')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByRole('button', { name: 'form.submit.loading' })).toBeDisabled();
    expect(screen.getByText('form.submit.loading')).toBeVisible();
    expect(screen.queryByText('form.submit.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText('form.username.label')).toBeDisabled();
    expect(screen.getByLabelText('form.password.label')).toBeDisabled();
  });
});
