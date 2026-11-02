import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ActiveQuiz } from '@/types/quiz';

import QuizList from './index';

vi.mock('./QuizItem', () => ({
  default: () => <li data-testid="quiz-item-mock" />,
}));

vi.mock('./EmptyState', () => ({
  default: () => <div data-testid="empty-state-mock" />,
}));

const fakeQuiz: ActiveQuiz = {
  id: 'fake-quiz-id',
  authorId: 'fake-user-id',
  title: 'Example quiz',
  status: 'draft',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

describe('QuizList', () => {
  it('renders list content correctly', () => {
    render(<QuizList quizzes={[fakeQuiz, { ...fakeQuiz, id: 'other-quiz-id' }]} />);

    expect(screen.getByRole('region', { name: 'content.list.label' })).toBeVisible();
    expect(screen.getByText('content.list.columns.title')).toBeVisible();
    expect(screen.getByText('content.list.columns.difficulty')).toBeVisible();
    expect(screen.getByText('content.list.columns.status')).toBeVisible();
    expect(screen.getByText('content.list.columns.updatedAt')).toBeVisible();
    expect(screen.getAllByTestId('quiz-item-mock')).toHaveLength(2);
    expect(screen.getByText('content.list.count')).toBeVisible();
    expect(screen.getByText('content.list.order')).toBeVisible();
    expect(screen.queryByTestId('empty-state-mock')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no quizzes', () => {
    render(<QuizList quizzes={[]} />);

    expect(screen.getByTestId('empty-state-mock')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('content.list.count')).not.toBeInTheDocument();
    expect(screen.queryByText('content.list.order')).not.toBeInTheDocument();
  });
});
