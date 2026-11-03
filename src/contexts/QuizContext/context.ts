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
  PublishQuizResult,
  UnpublishQuizResult,
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

export type PublishQuizErrorReason =
  | 'unauthenticated'
  | 'quizNotFound'
  | 'notAuthor'
  | 'notDraft'
  | 'invalidTitle'
  | 'missingDifficulty'
  | 'noValidQuestions';

export type PublishQuizActionResult =
  | PublishQuizResult
  | {
      success: false;
      reason: PublishQuizErrorReason;
    };

export type UnpublishQuizActionResult =
  UnpublishQuizResult | { success: false; reason: 'unauthenticated' | 'notAuthor' | 'notPublished' };

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
  publishQuiz: (quizId: string) => PublishQuizActionResult;
  unpublishQuiz: (quizId: string) => UnpublishQuizActionResult;
  getQuizById: (quizId: string) => Quiz | undefined;
  getActiveQuizzesByAuthor: (authorId: string) => { success: true; quizzes: ActiveQuiz[] };
}

export const QuizContext = createContext<QuizContextValue | undefined>(undefined);
