import type { Quiz } from '@/types/quiz';

export type QuizListEntry = Pick<Quiz, 'id' | 'title' | 'description' | 'difficulty' | 'updatedAt'> & {
  status: 'draft' | 'published';
};
