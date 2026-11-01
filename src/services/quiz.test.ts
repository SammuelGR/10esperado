import { describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import { createQuiz, getActiveQuizzesByAuthor } from './quiz';

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

describe('getActiveQuizzesByAuthor', () => {
  it('returns only active quizzes belonging to the author', () => {
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

    const result = getActiveQuizzesByAuthor(fakeQuiz.authorId);

    expect(result).toEqual({ success: true, quizzes: [fakeStoredQuizzes[0], fakeStoredQuizzes[1]] });
  });

  it('orders quizzes by updatedAt descending', () => {
    const fakeStoredQuizzes = [
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

    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(fakeStoredQuizzes));

    const result = getActiveQuizzesByAuthor(fakeQuiz.authorId);

    expect(result.quizzes.map((quiz) => quiz.updatedAt)).toEqual([
      '2026-10-06T10:00:00.000Z',
      '2026-10-05T10:00:00.000Z',
      '2026-10-04T10:00:00.000Z',
    ]);
  });
});
