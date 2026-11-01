import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getActiveQuizzesByAuthor } from '@/services/quiz';
import { renderWithRouter } from '@/test/render';
import type { ActiveQuiz } from '@/types/quiz';
import type { User } from '@/types/user';

import * as FiltersModule from './Filters';
import MyQuizzesPage from './index';
import * as QuizListModule from './QuizList';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: () => ({ user: fakeUser }),
}));

vi.mock('@/services/quiz', () => ({
  getActiveQuizzesByAuthor: vi.fn(),
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

const fakeQuiz: ActiveQuiz = {
  id: 'draft-algebra-quiz-id',
  authorId: fakeUser.id,
  title: 'Algebra basics',
  status: 'draft',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

const fakeQuizzes: ActiveQuiz[] = [
  fakeQuiz,
  { ...fakeQuiz, id: 'published-algebra-quiz-id', title: 'Algebra advanced', status: 'published' },
  {
    ...fakeQuiz,
    id: 'geometry-quiz-id',
    title: 'Geometry basics',
    description: 'Algebra notes',
    status: 'published',
  },
];

describe('MyQuizzesPage', () => {
  beforeEach(() => {
    vi.mocked(getActiveQuizzesByAuthor).mockReturnValue({ success: true, quizzes: fakeQuizzes });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page content correctly', () => {
    vi.spyOn(FiltersModule, 'default').mockImplementation(() => <div data-testid="filters-mock" />);
    vi.spyOn(QuizListModule, 'default').mockImplementation(() => <div data-testid="quiz-list-mock" />);

    renderWithRouter(<MyQuizzesPage />);

    expect(screen.getByText('content.title')).toBeVisible();
    expect(screen.getByText('content.description')).toBeVisible();
    expect(screen.getByTestId('filters-mock')).toBeInTheDocument();
    expect(screen.getByTestId('quiz-list-mock')).toBeInTheDocument();

    const newQuizLink = screen.getByRole('link', { name: 'content.actions.newQuiz' });

    expect(newQuizLink).toBeVisible();
    expect(newQuizLink).toHaveAttribute('href', '/my-quizzes/new');
  });

  describe('filters', () => {
    it('searches by title ignoring case and surrounding whitespace', async () => {
      const user = userEvent.setup();

      renderWithRouter(<MyQuizzesPage />);

      await user.type(screen.getByRole('searchbox', { name: 'content.filters.search.label' }), '  aLgEbRa  ');

      expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
        'Algebra basics',
        'Algebra advanced',
      ]);
    });

    it.each([
      { status: 'draft', expectedTitle: 'Algebra basics' },
      { status: 'published', expectedTitle: 'Algebra advanced' },
    ])('combines the title search with the $status status filter', async ({ status, expectedTitle }) => {
      const user = userEvent.setup();

      renderWithRouter(<MyQuizzesPage />);

      await user.type(screen.getByRole('searchbox', { name: 'content.filters.search.label' }), 'Algebra');
      await user.selectOptions(screen.getByRole('combobox', { name: 'content.filters.status.label' }), status);

      expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
        expectedTitle,
      ]);
    });

    it('shows no results and restores all quizzes when filters are cleared', async () => {
      const user = userEvent.setup();

      renderWithRouter(<MyQuizzesPage />);

      const search = screen.getByRole('searchbox', { name: 'content.filters.search.label' });
      const status = screen.getByRole('combobox', { name: 'content.filters.status.label' });

      await user.type(search, 'Geometry');
      await user.selectOptions(status, 'draft');

      expect(screen.getByRole('heading', { name: 'content.emptyStates.noResults.title' })).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'content.emptyStates.noResults.action' }));

      expect(search).toHaveValue('');
      expect(status).toHaveValue('all');
      expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
        'Algebra basics',
        'Algebra advanced',
        'Geometry basics',
      ]);
    });
  });
});
