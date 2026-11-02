import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/test/render';

import NewQuizPage from './index';

vi.mock('./QuizForm', () => ({
  default: () => <div data-testid="quiz-form-mock" />,
}));

describe('NewQuizPage', () => {
  it('renders page content correctly', () => {
    renderWithRouter(<NewQuizPage />);

    expect(screen.getByText('new.title')).toBeVisible();
    expect(screen.getByText('new.description')).toBeVisible();
    expect(screen.getByTestId('quiz-form-mock')).toBeInTheDocument();
    expect(screen.getByText('new.note')).toBeVisible();

    const backLink = screen.getByRole('link', { name: 'new.back' });

    expect(backLink).toBeVisible();
    expect(backLink).toHaveAttribute('href', '/my-quizzes');
  });
});
