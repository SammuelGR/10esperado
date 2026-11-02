import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import DeleteDialog from './index';

vi.mock('@/contexts/QuizContext/useQuiz', () => ({
  useQuiz: () => ({ getQuizById: () => fakeQuiz, deleteQuiz: fakeDeleteQuiz }),
}));

const fakeQuiz = {
  id: 'fake-quiz-id',
  title: 'Example quiz',
};

const fakeDeleteQuiz = vi.fn();

describe('DeleteDialog', () => {
  beforeEach(() => {
    fakeDeleteQuiz.mockReset();
    fakeDeleteQuiz.mockReturnValue({ success: true });
  });

  it('renders dialog content correctly', () => {
    render(<DeleteDialog dialogRef={createRef<HTMLDialogElement>()} quizId={fakeQuiz.id} />);
    screen.getByRole('dialog', { hidden: true }).setAttribute('open', '');

    expect(screen.getByRole('heading', { name: 'content.list.deleteDialog.title' })).toBeVisible();
    expect(screen.getByText('content.list.deleteDialog.description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'content.list.deleteDialog.cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'content.list.deleteDialog.confirm' })).toBeVisible();
  });

  it('deletes the selected quiz and closes the dialog on success', async () => {
    const user = userEvent.setup();
    const close = vi.fn();

    render(<DeleteDialog dialogRef={createRef<HTMLDialogElement>()} quizId={fakeQuiz.id} />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.setAttribute('open', '');

    // jsdom does not implement close.
    Object.defineProperty(dialog, 'close', { value: close });

    await user.click(screen.getByRole('button', { name: 'content.list.deleteDialog.confirm' }));

    expect(fakeDeleteQuiz).toHaveBeenCalledExactlyOnceWith(fakeQuiz.id);
    expect(close).toHaveBeenCalledOnce();
  });

  it.each(['unauthenticated', 'quizNotFound', 'notAuthor', 'quizDeleted'] as const)(
    'shows the %s error',
    async (reason) => {
      const user = userEvent.setup();
      fakeDeleteQuiz.mockReturnValue({ success: false, reason });

      render(<DeleteDialog dialogRef={createRef<HTMLDialogElement>()} quizId={fakeQuiz.id} />);
      screen.getByRole('dialog', { hidden: true }).setAttribute('open', '');

      await user.click(screen.getByRole('button', { name: 'content.list.deleteDialog.confirm' }));

      expect(screen.getByRole('alert')).toHaveTextContent(`content.list.deleteDialog.errors.${reason}`);
    },
  );

  it('shows a generic error when deletion throws', async () => {
    const user = userEvent.setup();
    fakeDeleteQuiz.mockImplementation(() => {
      throw new Error('Fake quiz deletion error');
    });

    render(<DeleteDialog dialogRef={createRef<HTMLDialogElement>()} quizId={fakeQuiz.id} />);
    screen.getByRole('dialog', { hidden: true }).setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'content.list.deleteDialog.confirm' }));

    expect(screen.getByRole('alert')).toHaveTextContent('content.list.deleteDialog.errors.failed');
  });

  it('clears the error when the dialog closes', async () => {
    const user = userEvent.setup();
    fakeDeleteQuiz.mockReturnValue({ success: false, reason: 'unauthenticated' });

    render(<DeleteDialog dialogRef={createRef<HTMLDialogElement>()} quizId={fakeQuiz.id} />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.setAttribute('open', '');

    await user.click(screen.getByRole('button', { name: 'content.list.deleteDialog.confirm' }));

    expect(screen.getByRole('alert')).toBeVisible();

    fireEvent(dialog, new Event('close'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
