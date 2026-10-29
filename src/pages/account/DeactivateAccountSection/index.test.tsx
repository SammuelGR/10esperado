import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

import DeactivateAccountSection from './index';

vi.mock('./ConfirmationDialog', () => ({
  default: ({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) => (
    <dialog data-testid="confirmation-dialog-mock" ref={dialogRef} />
  ),
}));

describe('DeactivateAccountSection', () => {
  it('renders section content correctly', () => {
    render(<DeactivateAccountSection />);

    expect(screen.getByText('deactivation.title')).toBeVisible();
    expect(screen.getByText('deactivation.description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'deactivation.action' })).toBeVisible();
    expect(screen.getByTestId('confirmation-dialog-mock')).toBeInTheDocument();
  });

  it('opens the confirmation dialog', async () => {
    const user = userEvent.setup();
    const showModal = vi.fn();

    render(<DeactivateAccountSection />);

    // jsdom does not implement showModal.
    Object.defineProperty(screen.getByTestId('confirmation-dialog-mock'), 'showModal', { value: showModal });

    await user.click(screen.getByRole('button', { name: 'deactivation.action' }));

    expect(showModal).toHaveBeenCalledOnce();
  });
});
