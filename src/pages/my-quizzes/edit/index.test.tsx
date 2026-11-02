import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import { renderWithRouter } from '@/test/render';
import type { ActiveQuiz } from '@/types/quiz';
import type { User } from '@/types/user';

import EditQuizPage from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/contexts/QuizContext/useQuiz', () => ({
  useQuiz: vi.fn(),
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

const fakeQuiz: ActiveQuiz = {
  id: 'fake-quiz-id',
  authorId: fakeUser.id,
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
  status: 'draft',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

const fakeGetQuizById = vi.fn();
const fakeEditQuiz = vi.fn();

describe('EditQuizPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ user: fakeUser });
    fakeGetQuizById.mockReset();
    fakeGetQuizById.mockReturnValue(fakeQuiz);
    fakeEditQuiz.mockReset();
    fakeEditQuiz.mockReturnValue({ success: true, quiz: fakeQuiz });
    vi.mocked(useQuiz, { partial: true }).mockReturnValue({
      getQuizById: fakeGetQuizById,
      editQuiz: fakeEditQuiz,
    });
  });

  it('renders the requested quiz metadata for editing', () => {
    renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);

    expect(fakeGetQuizById).toHaveBeenCalledWith(fakeQuiz.id);
    expect(screen.getByText('edit.title')).toBeVisible();
    expect(screen.getByText('edit.description')).toBeVisible();
    expect(screen.getByText('edit.note')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'form.quizTitle.label' })).toHaveValue(fakeQuiz.title);
    expect(screen.getByRole('textbox', { name: 'form.description.label' })).toHaveValue(fakeQuiz.description);
    expect(screen.getByRole('combobox', { name: 'form.difficulty.label' })).toHaveValue(fakeQuiz.difficulty);
    expect(screen.getByRole('link', { name: 'edit.back' })).toHaveAttribute('href', '/my-quizzes');
  });

  it('edits the quiz with validated metadata and returns to my quizzes', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.clear(screen.getByRole('textbox', { name: 'form.quizTitle.label' }));
    await user.type(screen.getByRole('textbox', { name: 'form.quizTitle.label' }), '  Updated quiz  ');
    await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

    await waitFor(() => {
      expect(fakeEditQuiz).toHaveBeenCalledExactlyOnceWith(fakeQuiz.id, {
        title: 'Updated quiz',
        description: fakeQuiz.description,
        difficulty: fakeQuiz.difficulty,
      });
      expect(navigate).toHaveBeenCalledWith({ to: '/my-quizzes', replace: true });
    });
  });

  it('does not submit invalid metadata', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.clear(screen.getByRole('textbox', { name: 'form.quizTitle.label' }));
    await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

    expect(await screen.findByText('form.quizTitle.errors.required')).toBeVisible();
    expect(fakeEditQuiz).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it.each(['unauthenticated', 'quizNotFound', 'notAuthor', 'quizDeleted', 'difficultyRequired'] as const)(
    'shows feedback and stays on the form when editing is rejected with %s',
    async (reason) => {
      const user = userEvent.setup();

      fakeEditQuiz.mockReturnValue({ success: false, reason });

      const { router } = renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

      await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

      expect(await screen.findByRole('alert')).toHaveTextContent(`edit.form.submit.errors.${reason}`);
      expect(screen.getByRole('textbox', { name: 'form.quizTitle.label' })).toHaveValue(fakeQuiz.title);
      expect(navigate).not.toHaveBeenCalled();
    },
  );

  it('shows feedback without navigating when persistence throws', async () => {
    const user = userEvent.setup();

    fakeEditQuiz.mockImplementation(() => {
      throw new Error('Fake storage error');
    });

    const { router } = renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('edit.form.submit.errors.failed');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('returns to my quizzes without editing when cancelled', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.click(screen.getByRole('button', { name: 'form.actions.cancel' }));

    expect(navigate).toHaveBeenCalledWith({ to: '/my-quizzes', replace: true });
    expect(fakeEditQuiz).not.toHaveBeenCalled();
  });

  it.each([
    { scenario: 'nonexistent', quiz: undefined },
    { scenario: 'deleted', quiz: { ...fakeQuiz, status: 'deleted' } },
    { scenario: 'owned by another author', quiz: { ...fakeQuiz, authorId: 'other-user-id' } },
  ])('shows an unavailable state for a quiz that is $scenario', ({ quiz }) => {
    fakeGetQuizById.mockReturnValue(quiz);

    renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);

    expect(screen.getByText('edit.unavailable.title')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'edit.form.submit.label' })).not.toBeInTheDocument();
    expect(fakeEditQuiz).not.toHaveBeenCalled();
  });

  it('loads the correct form values when the requested quiz changes', () => {
    const otherQuiz: ActiveQuiz = {
      ...fakeQuiz,
      id: 'other-quiz-id',
      title: 'Other quiz',
      description: undefined,
      difficulty: undefined,
    };

    fakeGetQuizById.mockImplementation((quizId: string) => (quizId === otherQuiz.id ? otherQuiz : fakeQuiz));

    const { rerender } = renderWithRouter(<EditQuizPage quizId={fakeQuiz.id} />);

    rerender(<EditQuizPage quizId={otherQuiz.id} />);

    expect(screen.getByRole('textbox', { name: 'form.quizTitle.label' })).toHaveValue(otherQuiz.title);
    expect(screen.getByRole('textbox', { name: 'form.description.label' })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: 'form.difficulty.label' })).toHaveValue('');
  });
});
