import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Filters from './index';

describe('Filters', () => {
  it('renders filters correctly', () => {
    render(<Filters onSearchChange={vi.fn()} onStatusChange={vi.fn()} search="" status="all" />);

    expect(screen.getByRole('searchbox', { name: 'content.filters.search.label' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'content.filters.status.label' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'content.filters.status.options.all' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'content.filters.status.options.draft' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'content.filters.status.options.published' })).toBeVisible();
  });

  it('notifies search changes with the entered text', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<Filters onSearchChange={onSearchChange} onStatusChange={vi.fn()} search="" status="all" />);

    await user.click(screen.getByRole('searchbox'));
    await user.paste('Example quiz');

    expect(onSearchChange).toHaveBeenCalledWith('Example quiz');
  });

  it('notifies status changes with the selected value', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(<Filters onSearchChange={vi.fn()} onStatusChange={onStatusChange} search="" status="all" />);

    await user.selectOptions(screen.getByRole('combobox'), 'published');

    expect(onStatusChange).toHaveBeenCalledWith('published');
  });
});
