import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PasswordInput from './index';

describe('PasswordInput', () => {
  it('renders password input correctly', () => {
    const onToggleVisibility = vi.fn();

    const { rerender } = render(
      <PasswordInput onToggleVisibility={onToggleVisibility} placeholder="Fake placeholder" visible={false} />,
    );

    expect(screen.getByPlaceholderText('Fake placeholder')).toBeVisible();
    expect(screen.getByPlaceholderText('Fake placeholder')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'form.password.visibility.show' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'form.password.visibility.hide' })).not.toBeInTheDocument();

    rerender(<PasswordInput onToggleVisibility={onToggleVisibility} placeholder="Fake placeholder" visible />);

    expect(screen.getByPlaceholderText('Fake placeholder')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'form.password.visibility.hide' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'form.password.visibility.show' })).not.toBeInTheDocument();
  });

  it('requests visibility change', async () => {
    const user = userEvent.setup();
    const onToggleVisibility = vi.fn();

    render(<PasswordInput onToggleVisibility={onToggleVisibility} visible={false} />);

    await user.click(screen.getByRole('button', { name: 'form.password.visibility.show' }));

    expect(onToggleVisibility).toHaveBeenCalledOnce();
  });
});
