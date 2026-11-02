import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { dateFormatter, timeFormatter } from '@/utils/formatters/date';

import QuizItem from './index';

vi.mock('./ActionsMenu', () => ({
  default: () => <div data-testid="actions-menu-mock" />,
}));

const fakeQuiz = {
  id: 'fake-quiz-id',
  authorId: 'fake-user-id',
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
  status: 'draft',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-02T12:30:00.000Z',
} as const;

describe('QuizItem', () => {
  it('renders quiz content correctly', () => {
    render(<QuizItem quiz={fakeQuiz} />);

    expect(screen.getByRole('heading', { name: fakeQuiz.title })).toBeVisible();
    expect(screen.getByText(fakeQuiz.description)).toBeVisible();
    expect(screen.getByText('content.list.status.draft')).toBeVisible();
    expect(screen.getByText(dateFormatter.format(new Date(fakeQuiz.updatedAt)))).toBeVisible();
    expect(screen.getByText(timeFormatter.format(new Date(fakeQuiz.updatedAt)))).toBeVisible();
    expect(screen.getByTestId('actions-menu-mock')).toBeInTheDocument();
  });

  it.each(['easy', 'medium', 'hard'] as const)('shows the %s difficulty', (difficulty) => {
    render(<QuizItem quiz={{ ...fakeQuiz, difficulty }} />);

    expect(screen.getByText(`content.list.difficulty.${difficulty}`)).toBeVisible();
  });

  it('omits the description and shows a dash when optional fields are absent', () => {
    render(<QuizItem quiz={{ ...fakeQuiz, description: undefined, difficulty: undefined }} />);

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeVisible();
  });

  it('shows the published status for a published quiz', () => {
    render(<QuizItem quiz={{ ...fakeQuiz, status: 'published' }} />);

    expect(screen.getByText('content.list.status.published')).toBeVisible();
  });
});
