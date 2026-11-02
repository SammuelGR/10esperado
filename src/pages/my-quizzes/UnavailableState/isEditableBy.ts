import type { ActiveQuiz, Quiz } from '@/types/quiz';

export function isEditableBy(quiz: Quiz | undefined, userId: string | undefined): quiz is ActiveQuiz {
  return quiz !== undefined && quiz.authorId === userId && quiz.status !== 'deleted';
}
