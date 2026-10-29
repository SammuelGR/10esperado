import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';

import UsernameForm from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

const fakeCurrentUsername = 'current_user';
const fakeNewUsername = 'updated_user';
const fakeUpdateUsername = vi.fn();

describe('UsernameForm', () => {
  beforeEach(() => {
    fakeUpdateUsername.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ updateUsername: fakeUpdateUsername });
  });

  it('renders form content correctly', () => {
    render(<UsernameForm username={fakeCurrentUsername} />);

    expect(screen.getByText('username.title')).toBeVisible();
    expect(screen.getByText('username.current')).toBeVisible();
    expect(screen.getByText(fakeCurrentUsername)).toBeVisible();
    expect(screen.getByLabelText('username.label')).toHaveAttribute('placeholder', 'username.placeholder');
    expect(screen.getByText('username.helper')).toBeVisible();
    expect(screen.getByRole('button', { name: 'username.action' })).toBeVisible();
  });

  it('submits the new username', async () => {
    const user = userEvent.setup();
    fakeUpdateUsername.mockReturnValue({ success: true });

    render(<UsernameForm username={fakeCurrentUsername} />);

    await user.type(screen.getByLabelText('username.label'), fakeNewUsername);
    await user.click(screen.getByRole('button', { name: 'username.action' }));

    await waitFor(() => {
      expect(fakeUpdateUsername).toHaveBeenCalledExactlyOnceWith(fakeNewUsername);
    });
    expect(await screen.findByRole('status')).toHaveTextContent('username.success');
    expect(screen.getByLabelText('username.label')).toHaveValue('');
  });

  it.each([
    { scenario: 'empty', value: '', message: 'username.errors.required' },
    { scenario: 'too short', value: 'ab', message: 'username.errors.length' },
    { scenario: 'too long', value: 'a'.repeat(25), message: 'username.errors.length' },
    { scenario: 'invalid', value: 'fake-user', message: 'username.errors.invalidCharacters' },
  ])('shows a validation error when the username is $scenario', async ({ value, message }) => {
    const user = userEvent.setup();

    render(<UsernameForm username={fakeCurrentUsername} />);

    if (value) {
      await user.type(screen.getByLabelText('username.label'), value);
    }

    await user.click(screen.getByRole('button', { name: 'username.action' }));

    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.getByLabelText('username.label')).toHaveAccessibleDescription(message);
    expect(fakeUpdateUsername).not.toHaveBeenCalled();
  });

  it('shows a duplicate username error', async () => {
    const user = userEvent.setup();
    fakeUpdateUsername.mockReturnValue({ success: false, reason: 'usernameTaken' });

    render(<UsernameForm username={fakeCurrentUsername} />);

    await user.type(screen.getByLabelText('username.label'), fakeNewUsername);
    await user.click(screen.getByRole('button', { name: 'username.action' }));

    expect(await screen.findByText('username.errors.usernameTaken')).toBeVisible();
    expect(screen.getByLabelText('username.label')).toHaveAccessibleDescription('username.errors.usernameTaken');
  });

  it('shows an account error', async () => {
    const user = userEvent.setup();
    fakeUpdateUsername.mockReturnValue({ success: false, reason: 'userNotFound' });

    render(<UsernameForm username={fakeCurrentUsername} />);

    await user.type(screen.getByLabelText('username.label'), fakeNewUsername);
    await user.click(screen.getByRole('button', { name: 'username.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('username.errors.userNotFound');
  });

  it('shows an error when updating the username throws', async () => {
    const user = userEvent.setup();
    fakeUpdateUsername.mockImplementation(() => {
      throw new Error('Fake username update error');
    });

    render(<UsernameForm username={fakeCurrentUsername} />);

    await user.type(screen.getByLabelText('username.label'), fakeNewUsername);
    await user.click(screen.getByRole('button', { name: 'username.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('username.errors.failed');
  });

  it('shows loading during submission', async () => {
    const user = userEvent.setup();
    fakeUpdateUsername.mockReturnValue({ success: true });

    render(<UsernameForm username={fakeCurrentUsername} />);

    await user.type(screen.getByLabelText('username.label'), fakeNewUsername);
    fireEvent.submit(screen.getByRole('form', { name: 'username.title' }));

    expect(screen.getByRole('button', { name: 'username.loading' })).toBeDisabled();
    expect(screen.getByLabelText('username.label')).toBeDisabled();
    expect(await screen.findByRole('status')).toHaveTextContent('username.success');
  });
});
