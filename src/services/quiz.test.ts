import { describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import { createQuiz, deleteQuiz, editQuiz, getQuizzes } from './quiz';

const fakeQuiz = {
  authorId: 'fake-user-id',
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
  status: 'draft',
  updatedAt: '2026-10-01T10:00:00.000Z',
} as const;

describe('createQuiz', () => {
  it('creates and persists a draft quiz', () => {
    const expectedQuiz = {
      id: expect.any(String),
      ...fakeQuiz,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    const result = createQuiz(fakeQuiz);

    expect(result).toEqual({ success: true, quiz: expectedQuiz });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.quizzes) ?? 'null')).toEqual([expectedQuiz]);
  });
});

describe('editQuiz', () => {
  it.each(['draft', 'published'] as const)(
    'persists metadata while preserving the %s quiz identity and status',
    (status) => {
      const storedQuiz = { ...fakeQuiz, id: 'fake-quiz-id', createdAt: fakeQuiz.updatedAt, status };
      const otherQuiz = { ...storedQuiz, id: 'other-quiz-id' };
      const values = { title: 'Updated quiz', description: 'Updated description', difficulty: 'hard' } as const;

      localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify([storedQuiz, otherQuiz]));

      const result = editQuiz({ quizId: storedQuiz.id, ...values });
      const expectedQuiz = { ...storedQuiz, ...values, updatedAt: expect.any(String) };

      expect(result).toEqual({ success: true, quiz: expectedQuiz });
      expect(getQuizzes().quizzes).toEqual([expectedQuiz, otherQuiz]);
      expect(getQuizzes().quizzes[0].updatedAt).not.toBe(storedQuiz.updatedAt);
    },
  );

  it('removes cleared optional metadata from storage', () => {
    const storedQuiz = { ...fakeQuiz, id: 'fake-quiz-id', createdAt: fakeQuiz.updatedAt };

    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify([storedQuiz]));

    editQuiz({ quizId: storedQuiz.id, title: storedQuiz.title, description: undefined, difficulty: undefined });

    const [quiz] = getQuizzes().quizzes;

    expect(quiz).not.toHaveProperty('description');
    expect(quiz).not.toHaveProperty('difficulty');
  });

  it('rejects an unknown id without modifying storage', () => {
    const storedQuiz = { ...fakeQuiz, id: 'fake-quiz-id', createdAt: fakeQuiz.updatedAt };

    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify([storedQuiz]));

    expect(editQuiz({ quizId: 'missing-quiz-id', title: 'Updated quiz' })).toEqual({
      success: false,
      reason: 'quizNotFound',
    });
    expect(getQuizzes().quizzes).toEqual([storedQuiz]);
  });

  it('propagates storage failures without changing the saved quiz', () => {
    const storedQuiz = { ...fakeQuiz, id: 'fake-quiz-id', createdAt: fakeQuiz.updatedAt };

    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify([storedQuiz]));

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Fake storage error');
    });

    try {
      expect(() => editQuiz({ quizId: storedQuiz.id, title: 'Updated quiz' })).toThrow('Fake storage error');
      expect(getQuizzes().quizzes).toEqual([storedQuiz]);
    } finally {
      setItem.mockRestore();
    }
  });
});

describe('deleteQuiz', () => {
  it('marks the stored quiz as deleted and updates updatedAt', () => {
    const storedQuiz = { ...fakeQuiz, id: 'fake-quiz-id', createdAt: fakeQuiz.updatedAt };

    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify([storedQuiz]));

    deleteQuiz(storedQuiz);

    const { quizzes } = getQuizzes();

    expect(quizzes[0].status).toBe('deleted');
    expect(quizzes[0].updatedAt).not.toBe(storedQuiz.updatedAt);
  });
});

describe('getQuizzes', () => {
  it('returns all stored quizzes regardless of author or status', () => {
    const fakeStoredQuizzes = [
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

    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(fakeStoredQuizzes));

    const result = getQuizzes();

    expect(result).toEqual({ success: true, quizzes: fakeStoredQuizzes });
  });
});
