import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Input from './index';

describe('Input', () => {
  it('renders input correctly', () => {
    render(<Input icon={<span>Fake icon</span>} placeholder="Fake placeholder" />);

    expect(screen.getByRole('textbox')).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Fake placeholder');
    expect(screen.getByText('Fake icon')).toBeVisible();
  });

  it('accepts text and notifies changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input onChange={onChange} />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'Fake value');

    expect(input).toHaveValue('Fake value');
    expect(onChange).toHaveBeenCalled();
  });

  it('prevents changes when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input disabled onChange={onChange} />);

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();

    await user.type(input, 'Fake value');

    expect(input).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });
});
