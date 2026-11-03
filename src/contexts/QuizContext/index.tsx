import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import {
  addQuestion as persistQuestion,
  createQuiz as persistQuiz,
  deleteQuestion as persistQuestionDeletion,
  deleteQuiz as persistQuizDeletion,
  editQuestion as persistQuestionEdit,
  editQuiz as persistQuizEdit,
  getQuizzes,
  publishQuiz as persistQuizPublication,
  unpublishQuiz as persistQuizUnpublication,
} from '@/services/quiz';
import type { AddQuestionParams, CreateQuizParams, EditQuestionParams, EditQuizParams } from '@/services/quiz';
import type { ActiveQuiz, Question } from '@/types/quiz';

import { QuizContext } from './context';
import type {
  AddQuestionActionResult,
  CreateQuizActionResult,
  DeleteQuestionActionResult,
  DeleteQuizActionResult,
  EditQuestionActionResult,
  EditQuizActionResult,
  PublishQuizActionResult,
  UnpublishQuizActionResult,
} from './context';

interface QuizProviderProps {
  children: ReactNode;
}

function isValidQuestion(question: Question): boolean {
  if (!question.statement.trim()) {
    return false;
  }

  if (!question.alternatives || question.alternatives.length < 2) {
    return false;
  }

  if (question.alternatives.some((alternative) => !alternative.text.trim())) {
    return false;
  }

  return question.alternatives.some((alternative) => alternative.id === question.correctAlternativeId);
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

  const addQuestion = useCallback(
    (quizId: string, values: Omit<AddQuestionParams, 'quizId'>): AddQuestionActionResult => {
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

      const result = persistQuestion({ ...values, quizId });

      if (result.success) {
        setQuizzes((currentQuizzes) =>
          currentQuizzes.map((storedQuiz) => (storedQuiz.id === quizId ? result.quiz : storedQuiz)),
        );
      }

      return result;
    },
    [user, getQuizById],
  );

  const deleteQuestion = useCallback(
    (quizId: string, questionId: string): DeleteQuestionActionResult => {
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

      if (!quiz.questions?.some((question) => question.id === questionId)) {
        return { success: false, reason: 'questionNotFound' };
      }

      if (quiz.status === 'published' && quiz.questions.length <= 1) {
        return { success: false, reason: 'lastValidQuestion' };
      }

      const result = persistQuestionDeletion({ quizId, questionId });

      if (result.success) {
        setQuizzes((currentQuizzes) =>
          currentQuizzes.map((storedQuiz) => (storedQuiz.id === quizId ? result.quiz : storedQuiz)),
        );
      }

      return result;
    },
    [user, getQuizById],
  );

  const editQuestion = useCallback(
    (
      quizId: string,
      questionId: string,
      values: Omit<EditQuestionParams, 'quizId' | 'questionId'>,
    ): EditQuestionActionResult => {
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

      if (!quiz.questions?.some((question) => question.id === questionId)) {
        return { success: false, reason: 'questionNotFound' };
      }

      const result = persistQuestionEdit({ ...values, quizId, questionId });

      if (result.success) {
        setQuizzes((currentQuizzes) =>
          currentQuizzes.map((storedQuiz) => (storedQuiz.id === quizId ? result.quiz : storedQuiz)),
        );
      }

      return result;
    },
    [user, getQuizById],
  );

  const editQuiz = useCallback(
    (quizId: string, values: Omit<EditQuizParams, 'quizId'>): EditQuizActionResult => {
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

      if (quiz.status === 'published' && !values.difficulty) {
        return { success: false, reason: 'difficultyRequired' };
      }

      const result = persistQuizEdit({ ...values, quizId });

      if (result.success) {
        setQuizzes((currentQuizzes) =>
          currentQuizzes.map((storedQuiz) => (storedQuiz.id === quizId ? result.quiz : storedQuiz)),
        );
      }

      return result;
    },
    [user, getQuizById],
  );

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

  const publishQuiz = useCallback(
    (quizId: string): PublishQuizActionResult => {
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

      if (quiz.status !== 'draft') {
        return { success: false, reason: 'notDraft' };
      }

      const trimmedTitle = quiz.title.trim();

      if (trimmedTitle.length < 1 || trimmedTitle.length > 50) {
        return { success: false, reason: 'invalidTitle' };
      }

      if (!quiz.difficulty) {
        return { success: false, reason: 'missingDifficulty' };
      }

      const hasValidQuestion = quiz.questions?.some(isValidQuestion) ?? false;

      if (!hasValidQuestion) {
        return { success: false, reason: 'noValidQuestions' };
      }

      const result = persistQuizPublication(quizId);

      if (result.success) {
        setQuizzes((currentQuizzes) =>
          currentQuizzes.map((storedQuiz) => (storedQuiz.id === quizId ? result.quiz : storedQuiz)),
        );
      }

      return result;
    },
    [user, getQuizById],
  );

  const unpublishQuiz = useCallback(
    (quizId: string): UnpublishQuizActionResult => {
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

      if (quiz.status !== 'published') {
        return { success: false, reason: 'notPublished' };
      }

      const result = persistQuizUnpublication(quizId);

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
    () => ({
      quizzes,
      addQuestion,
      deleteQuestion,
      editQuestion,
      createQuiz,
      editQuiz,
      deleteQuiz,
      publishQuiz,
      unpublishQuiz,
      getQuizById,
      getActiveQuizzesByAuthor,
    }),
    [
      quizzes,
      addQuestion,
      deleteQuestion,
      editQuestion,
      createQuiz,
      editQuiz,
      deleteQuiz,
      publishQuiz,
      unpublishQuiz,
      getQuizById,
      getActiveQuizzesByAuthor,
    ],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
