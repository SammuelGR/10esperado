import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Select from './index';

describe('Select', () => {
  it('renders select correctly', () => {
    render(
      <Select defaultValue="second">
        <option value="first">Fake first option</option>

        <option value="second">Fake second option</option>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toBeVisible();
    expect(screen.getByRole('combobox')).toHaveValue('second');
    expect(screen.getByRole('option', { name: 'Fake first option' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Fake second option' })).toBeVisible();
  });

  it('accepts selection and notifies changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select defaultValue="first" onChange={onChange}>
        <option value="first">Fake first option</option>

        <option value="second">Fake second option</option>
      </Select>,
    );

    const select = screen.getByRole('combobox');

    await user.selectOptions(select, 'second');

    expect(select).toHaveValue('second');
    expect(onChange).toHaveBeenCalled();
  });

  it('prevents changes when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select defaultValue="first" disabled onChange={onChange}>
        <option value="first">Fake first option</option>

        <option value="second">Fake second option</option>
      </Select>,
    );

    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();

    await user.selectOptions(select, 'second');

    expect(select).toHaveValue('first');
    expect(onChange).not.toHaveBeenCalled();
  });
});
