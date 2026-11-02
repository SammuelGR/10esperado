import { fireEvent, screen } from '@testing-library/react';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/test/render';

import ActionsMenu from './index';

vi.mock('@/contexts/QuizContext/useQuiz', () => ({
  useQuiz: () => ({ getQuizById: () => fakeQuiz }),
}));

vi.mock('./DeleteDialog', () => ({
  default: ({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) => (
    <dialog data-testid="delete-dialog-mock" ref={dialogRef} />
  ),
}));

const fakeQuiz = {
  id: 'fake-quiz-id',
  title: 'Example quiz',
};

describe('ActionsMenu', () => {
  it('renders action menu content correctly', () => {
    renderWithRouter(<ActionsMenu quizId={fakeQuiz.id} />);

    expect(screen.getByRole('button', { name: 'content.list.actions.label' })).toBeVisible();
    expect(screen.getByText('content.list.actions.edit')).toHaveAttribute('href', `/my-quizzes/${fakeQuiz.id}/edit`);
    expect(screen.getByText('content.list.actions.delete')).toBeInTheDocument();
    expect(screen.getByTestId('delete-dialog-mock')).toBeInTheDocument();
  });

  it('opens the delete dialog', () => {
    const showModal = vi.fn();

    renderWithRouter(<ActionsMenu quizId={fakeQuiz.id} />);

    // jsdom does not implement showModal or opening native popovers.
    Object.defineProperty(screen.getByTestId('delete-dialog-mock'), 'showModal', { value: showModal });

    fireEvent.click(screen.getByText('content.list.actions.delete'));

    expect(showModal).toHaveBeenCalledOnce();
  });
});
