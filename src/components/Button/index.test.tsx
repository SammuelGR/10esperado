import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Button from './index';

describe('Button', () => {
  it('renders button correctly', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Fake action</Button>);

    const button = screen.getByRole('button', { name: 'Fake action' });

    expect(button).toBeVisible();

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('prevents clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Fake action
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Fake action' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { rerender } = render(<Button loadingText="Fake loading">Fake action</Button>);

    expect(screen.getByText('Fake action')).toBeVisible();
    expect(screen.queryByText('Fake loading')).not.toBeInTheDocument();

    rerender(
      <Button loading loadingText="Fake loading">
        Fake action
      </Button>,
    );

    expect(screen.getByText('Fake loading')).toBeVisible();
    expect(screen.queryByText('Fake action')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fake loading' })).toBeDisabled();
  });

  it('keeps content when loading text is omitted', () => {
    render(<Button loading>Fake action</Button>);

    expect(screen.getByText('Fake action')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Fake action' })).toBeDisabled();
  });
});
