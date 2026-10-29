import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';

import PasswordForm from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

const fakePasswords = {
  currentPassword: 'CurrentFakePassword123!',
  newPassword: 'NewFakePassword123!',
};

const fakeUpdatePassword = vi.fn();

describe('PasswordForm', () => {
  beforeEach(() => {
    fakeUpdatePassword.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ updatePassword: fakeUpdatePassword });
  });

  it('renders form content correctly', () => {
    render(<PasswordForm />);

    expect(screen.getByText('password.title')).toBeVisible();
    expect(screen.getByLabelText('password.current.label')).toHaveAttribute(
      'placeholder',
      'password.current.placeholder',
    );
    expect(screen.getByLabelText('password.next.label')).toHaveAttribute('placeholder', 'password.next.placeholder');
    expect(screen.getByLabelText('password.confirm.label')).toHaveAttribute(
      'placeholder',
      'password.confirm.placeholder',
    );
    expect(screen.getByText('password.next.helper')).toBeVisible();
    expect(screen.getByRole('button', { name: 'password.action' })).toBeVisible();
  });

  it('submits the current and new passwords', async () => {
    const user = userEvent.setup();
    fakeUpdatePassword.mockResolvedValue({ success: true });

    render(<PasswordForm />);

    await user.type(screen.getByLabelText('password.current.label'), fakePasswords.currentPassword);
    await user.type(screen.getByLabelText('password.next.label'), fakePasswords.newPassword);
    await user.type(screen.getByLabelText('password.confirm.label'), fakePasswords.newPassword);
    await user.click(screen.getByRole('button', { name: 'password.action' }));

    await waitFor(() => {
      expect(fakeUpdatePassword).toHaveBeenCalledExactlyOnceWith(fakePasswords);
    });
    expect(await screen.findByRole('status')).toHaveTextContent('password.success');
    expect(screen.getByLabelText('password.current.label')).toHaveValue('');
    expect(screen.getByLabelText('password.next.label')).toHaveValue('');
    expect(screen.getByLabelText('password.confirm.label')).toHaveValue('');
  });

  it('shows required field errors when submitted empty', async () => {
    const user = userEvent.setup();

    render(<PasswordForm />);

    await user.click(screen.getByRole('button', { name: 'password.action' }));

    expect(await screen.findByText('password.current.errors.required')).toBeVisible();
    expect(screen.getByText('password.next.errors.required')).toBeVisible();
    expect(screen.getByText('password.confirm.errors.required')).toBeVisible();
    expect(fakeUpdatePassword).not.toHaveBeenCalled();
  });

  it.each([
    {
      scenario: 'the new password is too short',
      newPassword: 'short',
      confirmPassword: 'short',
      label: 'password.next.label',
      message: 'password.next.errors.length',
    },
    {
      scenario: 'the new password is too long',
      newPassword: 'a'.repeat(65),
      confirmPassword: 'a'.repeat(65),
      label: 'password.next.label',
      message: 'password.next.errors.length',
    },
    {
      scenario: 'the new password contains invalid characters',
      newPassword: 'NewFakePasswordá1!',
      confirmPassword: 'NewFakePasswordá1!',
      label: 'password.next.label',
      message: 'password.next.errors.invalidCharacters',
    },
    {
      scenario: 'the confirmation does not match',
      newPassword: fakePasswords.newPassword,
      confirmPassword: 'DifferentFakePassword123!',
      label: 'password.confirm.label',
      message: 'password.confirm.errors.mismatch',
    },
  ])('shows a validation error when $scenario', async ({ newPassword, confirmPassword, label, message }) => {
    const user = userEvent.setup();

    render(<PasswordForm />);

    await user.type(screen.getByLabelText('password.current.label'), fakePasswords.currentPassword);
    await user.type(screen.getByLabelText('password.next.label'), newPassword);
    await user.type(screen.getByLabelText('password.confirm.label'), confirmPassword);
    await user.click(screen.getByRole('button', { name: 'password.action' }));

    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.getByLabelText(label)).toHaveAccessibleDescription(message);
    expect(fakeUpdatePassword).not.toHaveBeenCalled();
  });

  it('shows an incorrect current password error', async () => {
    const user = userEvent.setup();
    fakeUpdatePassword.mockResolvedValue({ success: false, reason: 'incorrectCurrentPassword' });

    render(<PasswordForm />);

    await user.type(screen.getByLabelText('password.current.label'), fakePasswords.currentPassword);
    await user.type(screen.getByLabelText('password.next.label'), fakePasswords.newPassword);
    await user.type(screen.getByLabelText('password.confirm.label'), fakePasswords.newPassword);
    await user.click(screen.getByRole('button', { name: 'password.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('password.errors.incorrectCurrentPassword');
    expect(screen.getByLabelText('password.current.label')).toHaveAccessibleDescription(
      'password.errors.incorrectCurrentPassword',
    );
  });

  it('shows an account error', async () => {
    const user = userEvent.setup();
    fakeUpdatePassword.mockResolvedValue({ success: false, reason: 'userNotFound' });

    render(<PasswordForm />);

    await user.type(screen.getByLabelText('password.current.label'), fakePasswords.currentPassword);
    await user.type(screen.getByLabelText('password.next.label'), fakePasswords.newPassword);
    await user.type(screen.getByLabelText('password.confirm.label'), fakePasswords.newPassword);
    await user.click(screen.getByRole('button', { name: 'password.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('password.errors.userNotFound');
  });

  it('shows an error when updating the password throws', async () => {
    const user = userEvent.setup();
    fakeUpdatePassword.mockRejectedValue(new Error('Fake password update error'));

    render(<PasswordForm />);

    await user.type(screen.getByLabelText('password.current.label'), fakePasswords.currentPassword);
    await user.type(screen.getByLabelText('password.next.label'), fakePasswords.newPassword);
    await user.type(screen.getByLabelText('password.confirm.label'), fakePasswords.newPassword);
    await user.click(screen.getByRole('button', { name: 'password.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('password.errors.failed');
  });

  it('shows loading during submission', async () => {
    const user = userEvent.setup();
    fakeUpdatePassword.mockReturnValue(new Promise(() => {}));

    render(<PasswordForm />);

    await user.type(screen.getByLabelText('password.current.label'), fakePasswords.currentPassword);
    await user.type(screen.getByLabelText('password.next.label'), fakePasswords.newPassword);
    await user.type(screen.getByLabelText('password.confirm.label'), fakePasswords.newPassword);
    await user.click(screen.getByRole('button', { name: 'password.action' }));

    expect(await screen.findByRole('button', { name: 'password.loading' })).toBeDisabled();
    expect(screen.getByLabelText('password.current.label')).toBeDisabled();
    expect(screen.getByLabelText('password.next.label')).toBeDisabled();
    expect(screen.getByLabelText('password.confirm.label')).toBeDisabled();
  });

  it('toggles visibility for all password fields', async () => {
    const user = userEvent.setup();

    render(<PasswordForm />);

    const currentPassword = screen.getByLabelText('password.current.label');
    const newPassword = screen.getByLabelText('password.next.label');
    const confirmPassword = screen.getByLabelText('password.confirm.label');

    await user.click(screen.getAllByRole('button', { name: 'form.password.visibility.show' })[0]);

    expect(currentPassword).toHaveAttribute('type', 'text');
    expect(newPassword).toHaveAttribute('type', 'text');
    expect(confirmPassword).toHaveAttribute('type', 'text');

    await user.click(screen.getAllByRole('button', { name: 'form.password.visibility.hide' })[2]);

    expect(currentPassword).toHaveAttribute('type', 'password');
    expect(newPassword).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');
  });
});
