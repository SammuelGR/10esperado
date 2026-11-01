import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithRouter } from '@/test/render';

import MyQuizzesPage from './index';

describe('MyQuizzesPage', () => {
  it('renders page content correctly', () => {
    renderWithRouter(<MyQuizzesPage />);

    expect(screen.getByText('content.title')).toBeVisible();
    expect(screen.getByText('content.description')).toBeVisible();

    const newQuizLink = screen.getByRole('link', { name: 'content.actions.newQuiz' });

    expect(newQuizLink).toBeVisible();
    expect(newQuizLink).toHaveAttribute('href', '/my-quizzes/new');
  });
});
