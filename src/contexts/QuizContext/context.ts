import { createContext } from 'react';

import type {
  AddQuestionParams,
  AddQuestionResult,
  CreateQuizParams,
  CreateQuizResult,
  DeleteQuestionResult,
  DeleteQuizResult,
  EditQuestionParams,
  EditQuestionResult,
  EditQuizParams,
  EditQuizResult,
} from '@/services/quiz';
import type { ActiveQuiz, Quiz } from '@/types/quiz';

export type CreateQuizActionResult = CreateQuizResult | { success: false; reason: 'unauthenticated' };

export type AddQuestionActionResult =
  AddQuestionResult | { success: false; reason: 'unauthenticated' | 'notAuthor' | 'quizDeleted' };

export type EditQuestionActionResult =
  EditQuestionResult | { success: false; reason: 'unauthenticated' | 'notAuthor' | 'quizDeleted' };

export type DeleteQuestionActionResult =
  | DeleteQuestionResult
  | { success: false; reason: 'unauthenticated' | 'notAuthor' | 'quizDeleted' | 'lastValidQuestion' };

export type EditQuizActionResult =
  EditQuizResult | { success: false; reason: 'unauthenticated' | 'notAuthor' | 'quizDeleted' | 'difficultyRequired' };

export type DeleteQuizActionResult =
  DeleteQuizResult | { success: false; reason: 'unauthenticated' | 'quizNotFound' | 'notAuthor' | 'quizDeleted' };

interface QuizContextValue {
  quizzes: Quiz[];
  addQuestion: (quizId: string, values: Omit<AddQuestionParams, 'quizId'>) => AddQuestionActionResult;
  deleteQuestion: (quizId: string, questionId: string) => DeleteQuestionActionResult;
  editQuestion: (
    quizId: string,
    questionId: string,
    values: Omit<EditQuestionParams, 'quizId' | 'questionId'>,
  ) => EditQuestionActionResult;
  createQuiz: (params: Omit<CreateQuizParams, 'authorId'>) => CreateQuizActionResult;
  editQuiz: (quizId: string, values: Omit<EditQuizParams, 'quizId'>) => EditQuizActionResult;
  deleteQuiz: (quizId: string) => DeleteQuizActionResult;
  getQuizById: (quizId: string) => Quiz | undefined;
  getActiveQuizzesByAuthor: (authorId: string) => { success: true; quizzes: ActiveQuiz[] };
}

export const QuizContext = createContext<QuizContextValue | undefined>(undefined);
