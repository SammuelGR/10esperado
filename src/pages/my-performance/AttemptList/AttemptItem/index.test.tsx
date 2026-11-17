import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import type { Attempt } from '@/types/attempt';
import type { Quiz } from '@/types/quiz';
import { dateFormatter, timeFormatter } from '@/utils/formatters/date';

import AttemptItem from './index';

vi.mock('@/contexts/QuizContext/useQuiz', () => ({
  useQuiz: vi.fn(),
}));

const fakeQuiz: Quiz = {
  id: 'fake-quiz-id',
  authorId: 'fake-author-id',
  title: 'Example quiz',
  status: 'published',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

const fakeAttempt: Attempt = {
  id: 'fake-attempt-id',
  userId: 'fake-user-id',
  quizId: fakeQuiz.id,
  completedAt: '2026-10-02T12:30:00.000Z',
  correct: 7,
  incorrect: 2,
  unanswered: 1,
};

describe('AttemptItem', () => {
  beforeEach(() => {
    vi.mocked(useQuiz, { partial: true }).mockReturnValue({ getQuizById: () => fakeQuiz });
  });

  it('renders attempt content correctly', () => {
    render(<AttemptItem attempt={fakeAttempt} />);

    expect(screen.getByRole('heading', { name: fakeQuiz.title })).toBeVisible();
    expect(screen.getByText('content.list.columns.correct')).toBeVisible();
    expect(screen.getByText(String(fakeAttempt.correct))).toBeVisible();
    expect(screen.getByText('content.list.columns.incorrect')).toBeVisible();
    expect(screen.getByText(String(fakeAttempt.incorrect))).toBeVisible();
    expect(screen.getByText('content.list.columns.unanswered')).toBeVisible();
    expect(screen.getByText(String(fakeAttempt.unanswered))).toBeVisible();
    expect(screen.getByText(dateFormatter.format(new Date(fakeAttempt.completedAt)))).toBeVisible();
    expect(screen.getByText(timeFormatter.format(new Date(fakeAttempt.completedAt)))).toBeVisible();
  });

  it('shows the fallback title when the quiz is not found', () => {
    vi.mocked(useQuiz, { partial: true }).mockReturnValue({ getQuizById: () => undefined });

    render(<AttemptItem attempt={fakeAttempt} />);

    expect(screen.getByRole('heading', { name: 'content.list.unknownQuiz' })).toBeVisible();
  });
});
