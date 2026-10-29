import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { createUser } from '@/services/user';
import { renderWithRouter } from '@/test/render';
import type { User } from '@/types/user';

import RegisterForm from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/services/user', () => ({
  createUser: vi.fn(),
}));

const fakeCredentials = {
  username: 'test_user',
  password: 'TestPassword123!',
};

const fakeUser: User = {
  id: 'fake-user-id',
  username: fakeCredentials.username,
  status: 'active',
};

const fakeLogin = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.mocked(createUser).mockReset();
    vi.mocked(createUser).mockResolvedValue({ success: true, user: fakeUser });
    fakeLogin.mockReset();
    fakeLogin.mockResolvedValue({ success: true, user: fakeUser });
    vi.mocked(useAuth).mockReturnValue({ user: null, login: fakeLogin, logout: vi.fn() });
  });

  it('renders form content correctly', () => {
    renderWithRouter(<RegisterForm />);

    expect(screen.getByLabelText('form.username.label')).toHaveAttribute('placeholder', 'form.username.placeholder');
    expect(screen.getByLabelText('form.password.label')).toHaveAttribute('placeholder', 'form.password.placeholder');
    expect(screen.getByLabelText('form.confirmPassword.label')).toHaveAttribute(
      'placeholder',
      'form.confirmPassword.placeholder',
    );
    expect(screen.getByText('form.username.helper')).toBeVisible();
    expect(screen.getByText('form.password.helper')).toBeVisible();
    expect(screen.getByRole('button', { name: 'form.submit.label' })).toBeInTheDocument();
  });

  it('creates a user and logs in with the registered credentials', async () => {
    const user = userEvent.setup();

    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.type(screen.getByLabelText('form.confirmPassword.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledExactlyOnceWith(fakeCredentials);
      expect(fakeLogin).toHaveBeenCalledExactlyOnceWith(fakeCredentials);
    });
  });

  it.each([
    { scenario: 'returns a failure', result: { success: false, reason: 'invalidCredentials' } },
    { scenario: 'throws an error', result: new Error('Fake login error') },
  ])('redirects to login when authentication $scenario', async ({ result }) => {
    const user = userEvent.setup();

    if (result instanceof Error) {
      fakeLogin.mockRejectedValue(result);
    } else {
      fakeLogin.mockResolvedValue(result);
    }

    const { router } = renderWithRouter(<RegisterForm />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.type(screen.getByLabelText('form.confirmPassword.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ to: '/login' }));
    });
  });

  it.each([
    {
      scenario: 'username is empty',
      overrides: { username: '' },
      field: 'username',
      message: 'form.username.errors.required',
    },
    {
      scenario: 'username is too short',
      overrides: { username: 'ab' },
      field: 'username',
      message: 'form.username.errors.length',
    },
    {
      scenario: 'username is too long',
      overrides: { username: 'a'.repeat(25) },
      field: 'username',
      message: 'form.username.errors.length',
    },
    {
      scenario: 'username contains invalid characters',
      overrides: { username: 'test-user' },
      field: 'username',
      message: 'form.username.errors.invalidCharacters',
    },
    {
      scenario: 'password is empty',
      overrides: { password: '' },
      field: 'password',
      message: 'form.password.errors.required',
    },
    {
      scenario: 'password is too short',
      overrides: { password: 'short' },
      field: 'password',
      message: 'form.password.errors.length',
    },
    {
      scenario: 'password is too long',
      overrides: { password: 'a'.repeat(65) },
      field: 'password',
      message: 'form.password.errors.length',
    },
    {
      scenario: 'password contains invalid characters',
      overrides: { password: 'TestPasswordá1!' },
      field: 'password',
      message: 'form.password.errors.invalidCharacters',
    },
    {
      scenario: 'password confirmation is empty',
      overrides: { confirmPassword: '' },
      field: 'confirmPassword',
      message: 'form.confirmPassword.errors.required',
    },
    {
      scenario: 'password confirmation does not match',
      overrides: { confirmPassword: 'DifferentPassword123!' },
      field: 'confirmPassword',
      message: 'form.confirmPassword.errors.mismatch',
    },
  ] as const)('shows the validation message when $scenario', async ({ overrides, field, message }) => {
    const user = userEvent.setup();

    const values = {
      ...fakeCredentials,
      confirmPassword: fakeCredentials.password,
      ...overrides,
    };

    renderWithRouter(<RegisterForm />);

    if (values.username) {
      await user.type(screen.getByLabelText('form.username.label'), values.username);
    }

    if (values.password) {
      await user.type(screen.getByLabelText('form.password.label'), values.password);
    }

    if (values.confirmPassword) {
      await user.type(screen.getByLabelText('form.confirmPassword.label'), values.confirmPassword);
    }

    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.getByLabelText(`form.${field}.label`)).toHaveAccessibleDescription(message);
    expect(createUser).not.toHaveBeenCalled();
  });

  it('shows duplicate username error', async () => {
    const user = userEvent.setup();

    vi.mocked(createUser).mockResolvedValue({ success: false, reason: 'usernameTaken' });

    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.type(screen.getByLabelText('form.confirmPassword.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByText('form.username.errors.duplicate')).toBeVisible();
  });

  it('shows submission error', async () => {
    const user = userEvent.setup();

    vi.mocked(createUser).mockRejectedValue(new Error('fake error'));

    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.type(screen.getByLabelText('form.confirmPassword.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByText('form.submit.errors.failed')).toBeVisible();
  });

  it('shows loading and disables the controls while registration is pending', async () => {
    const user = userEvent.setup();

    vi.mocked(createUser).mockReturnValue(new Promise(() => {}));

    renderWithRouter(<RegisterForm />);

    expect(screen.getByText('form.submit.label')).toBeVisible();
    expect(screen.queryByText('form.submit.loading')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('form.username.label'), fakeCredentials.username);
    await user.type(screen.getByLabelText('form.password.label'), fakeCredentials.password);
    await user.type(screen.getByLabelText('form.confirmPassword.label'), fakeCredentials.password);
    await user.click(screen.getByRole('button', { name: 'form.submit.label' }));

    expect(await screen.findByRole('button', { name: 'form.submit.loading' })).toBeDisabled();
    expect(screen.getByText('form.submit.loading')).toBeVisible();
    expect(screen.queryByText('form.submit.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText('form.username.label')).toBeDisabled();
    expect(screen.getByLabelText('form.password.label')).toBeDisabled();
    expect(screen.getByLabelText('form.confirmPassword.label')).toBeDisabled();
  });
});
