import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Textarea from './index';

describe('Textarea', () => {
  it('renders textarea correctly', () => {
    render(<Textarea placeholder="Fake placeholder" />);

    expect(screen.getByRole('textbox')).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Fake placeholder');
  });

  it('accepts text and notifies changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Textarea onChange={onChange} />);

    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'Fake first line{Enter}Fake second line');

    expect(textarea).toHaveValue('Fake first line\nFake second line');
    expect(onChange).toHaveBeenCalled();
  });

  it('prevents changes when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Textarea disabled onChange={onChange} />);

    const textarea = screen.getByRole('textbox');

    expect(textarea).toBeDisabled();

    await user.type(textarea, 'Fake value');

    expect(textarea).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });
});
