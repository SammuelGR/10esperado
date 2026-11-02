import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { createQuiz, deleteQuiz, getQuizzes } from '@/services/quiz';
import type { Quiz } from '@/types/quiz';
import type { User } from '@/types/user';

import QuizProvider from './index';
import { useQuiz } from './useQuiz';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/services/quiz', () => ({
  createQuiz: vi.fn(),
  deleteQuiz: vi.fn(),
  getQuizzes: vi.fn(),
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

const fakeQuizValues = {
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
} as const;

const fakeQuiz: Quiz = {
  id: 'fake-quiz-id',
  authorId: fakeUser.id,
  ...fakeQuizValues,
  status: 'draft',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

describe('QuizProvider', () => {
  beforeEach(() => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ user: fakeUser });
    vi.mocked(getQuizzes).mockReset();
    vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: [fakeQuiz] });
    vi.mocked(createQuiz).mockReset();
    vi.mocked(deleteQuiz).mockReset();
  });

  it('initializes the context with the quizzes returned by the service', () => {
    const fakeStoredQuizzes: Quiz[] = [
      fakeQuiz,
      { ...fakeQuiz, id: 'other-quiz-id', authorId: 'other-user-id', status: 'deleted' },
    ];

    vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: fakeStoredQuizzes });

    const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

    expect(result.current.quizzes).toEqual(fakeStoredQuizzes);
  });

  describe('createQuiz', () => {
    it('creates a quiz with the authenticated author and updates shared state', () => {
      const fakeCreatedQuiz: Quiz = { ...fakeQuiz, id: 'new-quiz-id' };

      vi.mocked(createQuiz).mockReturnValue({ success: true, quiz: fakeCreatedQuiz });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      act(() => {
        expect(result.current.createQuiz(fakeQuizValues)).toEqual({ success: true, quiz: fakeCreatedQuiz });
      });

      expect(createQuiz).toHaveBeenCalledWith({ ...fakeQuizValues, authorId: fakeUser.id });
      expect(result.current.quizzes).toEqual([fakeQuiz, fakeCreatedQuiz]);
    });

    it('rejects quiz creation without authentication', () => {
      vi.mocked(useAuth, { partial: true }).mockReturnValue({ user: null });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.createQuiz(fakeQuizValues)).toEqual({ success: false, reason: 'unauthenticated' });
      expect(createQuiz).not.toHaveBeenCalled();
    });
  });

  describe('deleteQuiz', () => {
    it.each(['draft', 'published'] as const)('deletes a %s quiz and updates shared state', (status) => {
      const quiz: Quiz = { ...fakeQuiz, status };
      const deletedQuiz: Quiz = { ...quiz, status: 'deleted' };

      vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: [quiz] });
      vi.mocked(deleteQuiz).mockReturnValue({ success: true, quiz: deletedQuiz });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      act(() => {
        expect(result.current.deleteQuiz(quiz.id)).toEqual({ success: true, quiz: deletedQuiz });
      });

      expect(deleteQuiz).toHaveBeenCalledWith(quiz);
      expect(result.current.quizzes).toEqual([deletedQuiz]);
    });

    it('rejects deletion without authentication', () => {
      vi.mocked(useAuth, { partial: true }).mockReturnValue({ user: null });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.deleteQuiz(fakeQuiz.id)).toMatchObject({ reason: 'unauthenticated' });
    });

    it('rejects deletion of a nonexistent quiz', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.deleteQuiz('missing-quiz-id')).toMatchObject({ reason: 'quizNotFound' });
    });

    it('rejects deletion of a quiz owned by another author', () => {
      vi.mocked(getQuizzes).mockReturnValue({
        success: true,
        quizzes: [{ ...fakeQuiz, authorId: 'other-user-id' }],
      });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.deleteQuiz(fakeQuiz.id)).toMatchObject({ reason: 'notAuthor' });
    });

    it('rejects deletion of an already deleted quiz', () => {
      vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: [{ ...fakeQuiz, status: 'deleted' }] });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.deleteQuiz(fakeQuiz.id)).toMatchObject({ reason: 'quizDeleted' });
    });
  });

  describe('getQuizById', () => {
    it('finds a quiz by id and returns undefined when not found', () => {
      const otherQuiz: Quiz = { ...fakeQuiz, id: 'other-quiz-id' };

      vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: [fakeQuiz, otherQuiz] });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.getQuizById(otherQuiz.id)).toEqual(otherQuiz);
      expect(result.current.getQuizById('missing-quiz-id')).toBeUndefined();
    });
  });

  describe('getActiveQuizzesByAuthor', () => {
    it('returns only active quizzes belonging to the author', () => {
      const fakeStoredQuizzes: Quiz[] = [
        {
          ...fakeQuiz,
          id: 'draft-quiz-id',
          status: 'draft',
        },
        {
          ...fakeQuiz,
          id: 'published-quiz-id',
          status: 'published',
        },
        {
          ...fakeQuiz,
          id: 'deleted-quiz-id',
          status: 'deleted',
        },
        {
          ...fakeQuiz,
          id: 'other-author-quiz-id',
          authorId: 'other-user-id',
          status: 'published',
        },
      ];

      vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: fakeStoredQuizzes });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });

      expect(result.current.getActiveQuizzesByAuthor(fakeQuiz.authorId)).toEqual({
        success: true,
        quizzes: [fakeStoredQuizzes[0], fakeStoredQuizzes[1]],
      });
    });

    it('orders quizzes by updatedAt descending', () => {
      const fakeStoredQuizzes: Quiz[] = [
        {
          ...fakeQuiz,
          updatedAt: '2026-10-04T10:00:00.000Z',
        },
        {
          ...fakeQuiz,
          updatedAt: '2026-10-06T10:00:00.000Z',
        },
        {
          ...fakeQuiz,
          updatedAt: '2026-10-05T10:00:00.000Z',
        },
      ];

      vi.mocked(getQuizzes).mockReturnValue({ success: true, quizzes: fakeStoredQuizzes });

      const { result } = renderHook(() => useQuiz(), { wrapper: QuizProvider });
      const { quizzes } = result.current.getActiveQuizzesByAuthor(fakeQuiz.authorId);

      expect(quizzes.map((quiz) => quiz.updatedAt)).toEqual([
        '2026-10-06T10:00:00.000Z',
        '2026-10-05T10:00:00.000Z',
        '2026-10-04T10:00:00.000Z',
      ]);
    });
  });
});
