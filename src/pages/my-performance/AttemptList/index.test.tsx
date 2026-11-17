import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Attempt } from '@/types/attempt';

import AttemptList from './index';

vi.mock('./AttemptItem', () => ({
  default: () => <li data-testid="attempt-item-mock" />,
}));

vi.mock('./EmptyState', () => ({
  default: () => <div data-testid="empty-state-mock" />,
}));

const fakeAttempt: Attempt = {
  id: 'fake-attempt-id',
  userId: 'fake-user-id',
  quizId: 'fake-quiz-id',
  completedAt: '2026-10-02T12:30:00.000Z',
  correct: 7,
  incorrect: 2,
  unanswered: 1,
};

describe('AttemptList', () => {
  it('renders list content correctly', () => {
    render(<AttemptList attempts={[fakeAttempt, { ...fakeAttempt, id: 'other-attempt-id' }]} />);

    expect(screen.getByRole('heading', { name: 'content.list.title' })).toBeVisible();
    expect(screen.getByText('content.list.columns.title')).toBeVisible();
    expect(screen.getByText('content.list.columns.correct')).toBeVisible();
    expect(screen.getByText('content.list.columns.incorrect')).toBeVisible();
    expect(screen.getByText('content.list.columns.unanswered')).toBeVisible();
    expect(screen.getByText('content.list.columns.completedAt')).toBeVisible();
    expect(screen.getAllByTestId('attempt-item-mock')).toHaveLength(2);
    expect(screen.queryByTestId('empty-state-mock')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no attempts', () => {
    render(<AttemptList attempts={[]} />);

    expect(screen.getByTestId('empty-state-mock')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
