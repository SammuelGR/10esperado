import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/test/render';

import EmptyState from './index';

describe('EmptyState', () => {
  it('renders empty state content correctly', () => {
    renderWithRouter(<EmptyState />);

    expect(screen.getByRole('heading', { name: 'content.emptyStates.empty.title' })).toBeVisible();
    expect(screen.getByText('content.emptyStates.empty.description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'content.emptyStates.empty.action' })).toBeVisible();
  });

  it('renders no results content correctly', () => {
    renderWithRouter(<EmptyState variant="noResults" />);

    expect(screen.getByRole('heading', { name: 'content.emptyStates.noResults.title' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'content.emptyStates.noResults.action' })).toBeVisible();
    expect(screen.queryByText('content.emptyStates.empty.description')).not.toBeInTheDocument();
  });

  it('navigates to the new quiz page when the create action is selected', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(<EmptyState />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.click(screen.getByRole('button', { name: 'content.emptyStates.empty.action' }));

    expect(navigate).toHaveBeenCalledWith({ to: '/my-quizzes/new' });
  });

  it('requests clearing filters when the clear action is selected', async () => {
    const user = userEvent.setup();
    const onClearFilters = vi.fn();

    renderWithRouter(<EmptyState onClearFilters={onClearFilters} variant="noResults" />);

    await user.click(screen.getByRole('button', { name: 'content.emptyStates.noResults.action' }));

    expect(onClearFilters).toHaveBeenCalledOnce();
  });
});
