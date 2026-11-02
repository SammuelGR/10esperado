import { createContext } from 'react';

import type {
  CreateQuizParams,
  CreateQuizResult,
  DeleteQuizResult,
  EditQuizParams,
  EditQuizResult,
} from '@/services/quiz';
import type { ActiveQuiz, Quiz } from '@/types/quiz';

export type CreateQuizActionResult = CreateQuizResult | { success: false; reason: 'unauthenticated' };

export type EditQuizActionResult =
  EditQuizResult | { success: false; reason: 'unauthenticated' | 'notAuthor' | 'quizDeleted' | 'difficultyRequired' };

export type DeleteQuizActionResult =
  DeleteQuizResult | { success: false; reason: 'unauthenticated' | 'quizNotFound' | 'notAuthor' | 'quizDeleted' };

interface QuizContextValue {
  quizzes: Quiz[];
  createQuiz: (params: Omit<CreateQuizParams, 'authorId'>) => CreateQuizActionResult;
  editQuiz: (quizId: string, values: Omit<EditQuizParams, 'quizId'>) => EditQuizActionResult;
  deleteQuiz: (quizId: string) => DeleteQuizActionResult;
  getQuizById: (quizId: string) => Quiz | undefined;
  getActiveQuizzesByAuthor: (authorId: string) => { success: true; quizzes: ActiveQuiz[] };
}

export const QuizContext = createContext<QuizContextValue | undefined>(undefined);
