import { screen } from '@testing-library/react';
import { keyFromSelector } from 'i18next';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/test/render';

import NewQuizPage from './index';

vi.mock('./QuizForm', () => ({
  default: () => <div data-testid="quiz-form-mock" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: keyFromSelector }),
  Trans: ({ i18nKey }: { i18nKey: Parameters<typeof keyFromSelector>[0] }) => keyFromSelector(i18nKey),
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
