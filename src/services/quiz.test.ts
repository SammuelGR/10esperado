import { describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import { createQuiz } from './quiz';

const fakeQuiz = {
  authorId: 'fake-user-id',
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
} as const;

describe('createQuiz', () => {
  it('creates and persists a draft quiz', () => {
    const expectedQuiz = {
      id: expect.any(String),
      ...fakeQuiz,
      status: 'draft',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    const result = createQuiz(fakeQuiz);

    expect(result).toEqual({ success: true, quiz: expectedQuiz });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.quizzes) ?? 'null')).toEqual([expectedQuiz]);
  });
});
