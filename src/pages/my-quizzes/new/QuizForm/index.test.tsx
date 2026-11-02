import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import { renderWithRouter } from '@/test/render';
import type { Quiz } from '@/types/quiz';

import QuizForm from './index';

vi.mock('@/contexts/QuizContext/useQuiz', () => ({
  useQuiz: vi.fn(),
}));

const fakeQuizValues = {
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
} as const;

const fakeQuiz: Quiz = {
  id: 'fake-quiz-id',
  authorId: 'fake-user-id',
  ...fakeQuizValues,
  status: 'draft',
  createdAt: '2026-11-01T12:00:00.000Z',
  updatedAt: '2026-11-01T12:00:00.000Z',
};

const fakeCreateQuiz = vi.fn();

describe('QuizForm', () => {
  beforeEach(() => {
    fakeCreateQuiz.mockReset();
    fakeCreateQuiz.mockReturnValue({ success: true, quiz: fakeQuiz });
    vi.mocked(useQuiz, { partial: true }).mockReturnValue({ createQuiz: fakeCreateQuiz });
  });

  it('renders form content correctly', () => {
    renderWithRouter(<QuizForm />);

    expect(screen.getByText('new.form.title')).toBeVisible();
    expect(screen.getByText('new.form.status')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'new.form.quizTitle.label' })).toHaveAttribute(
      'placeholder',
      'new.form.quizTitle.placeholder',
    );
    expect(screen.getByRole('textbox', { name: 'new.form.description.label' })).toHaveAttribute(
      'placeholder',
      'new.form.description.placeholder',
    );
    expect(screen.getByText('new.form.quizTitle.helper')).toBeVisible();
    expect(screen.getByText('new.form.description.helper')).toBeVisible();
    expect(screen.getByText('new.form.difficulty.helper')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'new.form.difficulty.label' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'new.form.difficulty.placeholder' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'new.form.difficulty.options.easy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'new.form.difficulty.options.medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'new.form.difficulty.options.hard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'new.form.actions.cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'new.form.actions.submit' })).toBeVisible();
  });

  it('creates a quiz with the submitted metadata and navigates to my quizzes', async () => {
    const user = userEvent.setup();

    const { router } = renderWithRouter(<QuizForm />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.type(screen.getByRole('textbox', { name: 'new.form.quizTitle.label' }), `  ${fakeQuizValues.title}  `);
    await user.type(screen.getByRole('textbox', { name: 'new.form.description.label' }), fakeQuizValues.description);
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'new.form.difficulty.label' }),
      fakeQuizValues.difficulty,
    );
    await user.click(screen.getByRole('button', { name: 'new.form.actions.submit' }));

    await waitFor(() => {
      expect(fakeCreateQuiz).toHaveBeenCalledExactlyOnceWith(fakeQuizValues);
      expect(navigate).toHaveBeenCalledWith({ to: '/my-quizzes', replace: true });
    });
  });

  it.each([
    {
      scenario: 'title is empty',
      overrides: { title: '' },
      field: 'quizTitle',
      message: 'new.form.quizTitle.errors.required',
    },
    {
      scenario: 'title contains only whitespace',
      overrides: { title: '   ' },
      field: 'quizTitle',
      message: 'new.form.quizTitle.errors.required',
    },
    {
      scenario: 'title is too long',
      overrides: { title: 'a'.repeat(51) },
      field: 'quizTitle',
      message: 'new.form.quizTitle.errors.length',
    },
    {
      scenario: 'description is too long',
      overrides: { description: 'a'.repeat(1001) },
      field: 'description',
      message: 'new.form.description.errors.length',
    },
  ] as const)('shows the validation message when $scenario', async ({ overrides, field, message }) => {
    const user = userEvent.setup();
    const values = { ...fakeQuizValues, ...overrides };

    renderWithRouter(<QuizForm />);

    if (values.title) {
      await user.type(screen.getByRole('textbox', { name: 'new.form.quizTitle.label' }), values.title);
    }

    await user.type(screen.getByRole('textbox', { name: 'new.form.description.label' }), values.description);
    await user.click(screen.getByRole('button', { name: 'new.form.actions.submit' }));

    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.getByRole('textbox', { name: `new.form.${field}.label` })).toHaveAccessibleDescription(message);
    expect(fakeCreateQuiz).not.toHaveBeenCalled();
  });

  it('shows a submission error when creating the quiz throws', async () => {
    const user = userEvent.setup();

    fakeCreateQuiz.mockImplementation(() => {
      throw new Error('Fake quiz creation error');
    });

    const { router } = renderWithRouter(<QuizForm />);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);

    await user.type(screen.getByRole('textbox', { name: 'new.form.quizTitle.label' }), fakeQuizValues.title);
    await user.click(screen.getByRole('button', { name: 'new.form.actions.submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('new.form.submit.errors.failed');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows loading and disables the controls while navigation is pending', async () => {
    const user = userEvent.setup();

    const { router } = renderWithRouter(<QuizForm />);
    vi.spyOn(router, 'navigate').mockReturnValue(new Promise<void>(() => {}));

    expect(screen.getByText('new.form.actions.submit')).toBeVisible();
    expect(screen.queryByText('new.form.submit.loading')).not.toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'new.form.quizTitle.label' }), fakeQuizValues.title);
    await user.click(screen.getByRole('button', { name: 'new.form.actions.submit' }));

    expect(await screen.findByRole('button', { name: 'new.form.submit.loading' })).toBeDisabled();
    expect(screen.queryByText('new.form.actions.submit')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'new.form.quizTitle.label' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'new.form.description.label' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'new.form.difficulty.label' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'new.form.actions.cancel' })).toBeDisabled();
  });
});
