import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { keyFromSelector } from 'i18next';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { renderWithRouter } from '@/test/render';

import ConfirmationDialog from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: keyFromSelector }),
  Trans: ({ i18nKey }: { i18nKey: Parameters<typeof keyFromSelector>[0] }) => keyFromSelector(i18nKey),
}));

const fakeDeactivateAccount = vi.fn();

describe('ConfirmationDialog', () => {
  beforeEach(() => {
    fakeDeactivateAccount.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ deactivateAccount: fakeDeactivateAccount });
  });

  it('renders dialog content correctly', () => {
    renderWithRouter(<ConfirmationDialog dialogRef={createRef<HTMLDialogElement>()} />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.setAttribute('open', '');

    expect(screen.getByText('deactivation.confirmation.title')).toBeVisible();
    expect(screen.getByText('deactivation.confirmation.warning')).toBeVisible();
    expect(screen.getByText('deactivation.confirmation.preservation')).toBeVisible();
    expect(screen.getByRole('button', { name: 'deactivation.action' })).toBeVisible();

    const cancelButton = screen.getByRole('button', { name: 'deactivation.confirmation.cancel' });

    expect(cancelButton).toBeVisible();
    expect(cancelButton.closest('form')).toHaveAttribute('method', 'dialog');
  });

  it('deactivates the account and navigates to the home page', async () => {
    const user = userEvent.setup();
    fakeDeactivateAccount.mockReturnValue({ success: true });

    const { router } = renderWithRouter(<ConfirmationDialog dialogRef={createRef<HTMLDialogElement>()} />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);
    screen.getByRole('dialog', { hidden: true }).setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'deactivation.action' }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ to: '/', replace: true });
    });
    expect(fakeDeactivateAccount).toHaveBeenCalledOnce();
  });

  it('shows a deactivation error', async () => {
    const user = userEvent.setup();
    fakeDeactivateAccount.mockReturnValue({ success: false, reason: 'unauthenticated' });

    const { router } = renderWithRouter(<ConfirmationDialog dialogRef={createRef<HTMLDialogElement>()} />);
    const navigate = vi.spyOn(router, 'navigate');
    screen.getByRole('dialog', { hidden: true }).setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'deactivation.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('deactivation.confirmation.errors.unauthenticated');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows an error when deactivation throws', async () => {
    const user = userEvent.setup();
    fakeDeactivateAccount.mockImplementation(() => {
      throw new Error('Fake deactivation error');
    });

    renderWithRouter(<ConfirmationDialog dialogRef={createRef<HTMLDialogElement>()} />);
    screen.getByRole('dialog', { hidden: true }).setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'deactivation.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('deactivation.confirmation.errors.failed');
  });

  it('disables actions and blocks cancellation during navigation', async () => {
    const user = userEvent.setup();
    fakeDeactivateAccount.mockReturnValue({ success: true });

    const { router } = renderWithRouter(<ConfirmationDialog dialogRef={createRef<HTMLDialogElement>()} />);
    vi.spyOn(router, 'navigate').mockReturnValue(new Promise<void>(() => {}));
    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'deactivation.action' }));

    expect(await screen.findByRole('button', { name: 'deactivation.confirmation.loading' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'deactivation.confirmation.cancel' })).toBeDisabled();

    const cancelEvent = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
  });

  it('clears the error when the dialog closes', async () => {
    const user = userEvent.setup();
    fakeDeactivateAccount.mockReturnValue({ success: false, reason: 'unauthenticated' });

    renderWithRouter(<ConfirmationDialog dialogRef={createRef<HTMLDialogElement>()} />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'deactivation.action' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('deactivation.confirmation.errors.unauthenticated');

    fireEvent(dialog, new Event('close'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
