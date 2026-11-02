import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { createQuiz as persistQuiz, deleteQuiz as persistQuizDeletion, getQuizzes } from '@/services/quiz';
import type { CreateQuizParams } from '@/services/quiz';
import type { ActiveQuiz } from '@/types/quiz';

import { QuizContext } from './context';
import type { CreateQuizActionResult, DeleteQuizActionResult } from './context';

interface QuizProviderProps {
  children: ReactNode;
}

export default function QuizProvider({ children }: QuizProviderProps) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState(() => getQuizzes().quizzes);

  const createQuiz = useCallback(
    (params: Omit<CreateQuizParams, 'authorId'>): CreateQuizActionResult => {
      if (!user) {
        return { success: false, reason: 'unauthenticated' };
      }

      const result = persistQuiz({ ...params, authorId: user.id });

      if (result.success) {
        setQuizzes((currentQuizzes) => [...currentQuizzes, result.quiz]);
      }

      return result;
    },
    [user],
  );

  const getQuizById = useCallback((quizId: string) => quizzes.find((quiz) => quiz.id === quizId), [quizzes]);

  const deleteQuiz = useCallback(
    (quizId: string): DeleteQuizActionResult => {
      if (!user) {
        return { success: false, reason: 'unauthenticated' };
      }

      const quiz = getQuizById(quizId);

      if (!quiz) {
        return { success: false, reason: 'quizNotFound' };
      }

      if (quiz.authorId !== user.id) {
        return { success: false, reason: 'notAuthor' };
      }

      if (quiz.status === 'deleted') {
        return { success: false, reason: 'quizDeleted' };
      }

      const result = persistQuizDeletion(quiz);

      if (result.success) {
        setQuizzes((currentQuizzes) =>
          currentQuizzes.map((storedQuiz) => (storedQuiz.id === quizId ? result.quiz : storedQuiz)),
        );
      }

      return result;
    },
    [user, getQuizById],
  );

  const getActiveQuizzesByAuthor = useCallback(
    (authorId: string): { success: true; quizzes: ActiveQuiz[] } => {
      const activeQuizzes = quizzes
        .filter(
          (quiz): quiz is ActiveQuiz =>
            quiz.authorId === authorId && (quiz.status === 'draft' || quiz.status === 'published'),
        )
        .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));

      return { success: true, quizzes: activeQuizzes };
    },
    [quizzes],
  );

  const value = useMemo(
    () => ({ quizzes, createQuiz, deleteQuiz, getQuizById, getActiveQuizzesByAuthor }),
    [quizzes, createQuiz, deleteQuiz, getQuizById, getActiveQuizzesByAuthor],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
