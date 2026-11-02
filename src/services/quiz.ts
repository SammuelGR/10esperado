import { STORAGE_KEYS } from '@/constants/storage';
import type { Question, Quiz } from '@/types/quiz';

export interface DeleteQuestionParams {
  quizId: string;
  questionId: string;
}

export type DeleteQuestionResult =
  { success: true; quiz: Quiz } | { success: false; reason: 'quizNotFound' | 'questionNotFound' };

export interface AddQuestionParams {
  quizId: string;
  statement: string;
  alternatives: Question['alternatives'];
  correctAlternativeId: string;
}

export type AddQuestionResult = { success: true; quiz: Quiz } | { success: false; reason: 'quizNotFound' };

export interface EditQuestionParams {
  quizId: string;
  questionId: string;
  statement: string;
  alternatives: Question['alternatives'];
  correctAlternativeId: string;
}

export type EditQuestionResult =
  { success: true; quiz: Quiz } | { success: false; reason: 'quizNotFound' | 'questionNotFound' };

export interface CreateQuizParams {
  authorId: string;
  title: string;
  description?: string;
  difficulty?: NonNullable<Quiz['difficulty']>;
}

export interface EditQuizParams {
  quizId: string;
  title: string;
  description?: string;
  difficulty?: NonNullable<Quiz['difficulty']>;
}

export type CreateQuizResult = { success: true; quiz: Quiz };

export type EditQuizResult = { success: true; quiz: Quiz } | { success: false; reason: 'quizNotFound' };

export type DeleteQuizResult = { success: true; quiz: Quiz };

type GetQuizzesResult = { success: true; quizzes: Quiz[] };

function readQuizzes(): Quiz[] {
  const storedQuizzes = localStorage.getItem(STORAGE_KEYS.quizzes);

  return storedQuizzes === null ? [] : (JSON.parse(storedQuizzes) as Quiz[]);
}

function writeQuizzes(quizzes: Quiz[]): void {
  localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(quizzes));
}

export function getQuizzes(): GetQuizzesResult {
  return { success: true, quizzes: readQuizzes() };
}

export function deleteQuestion({ quizId, questionId }: DeleteQuestionParams): DeleteQuestionResult {
  const quizzes = readQuizzes();
  const quiz = quizzes.find((storedQuiz) => storedQuiz.id === quizId);

  if (!quiz) {
    return { success: false, reason: 'quizNotFound' };
  }

  if (!quiz.questions?.some((question) => question.id === questionId)) {
    return { success: false, reason: 'questionNotFound' };
  }

  const questions = quiz.questions.filter((question) => question.id !== questionId);

  const updatedQuiz: Quiz = { ...quiz, questions, updatedAt: new Date().toISOString() };

  writeQuizzes(quizzes.map((storedQuiz) => (storedQuiz.id === quizId ? updatedQuiz : storedQuiz)));

  return { success: true, quiz: updatedQuiz };
}

export function addQuestion({
  quizId,
  statement,
  alternatives,
  correctAlternativeId,
}: AddQuestionParams): AddQuestionResult {
  const quizzes = readQuizzes();
  const quiz = quizzes.find((storedQuiz) => storedQuiz.id === quizId);

  if (!quiz) {
    return { success: false, reason: 'quizNotFound' };
  }

  const question: Question = {
    id: crypto.randomUUID(),
    type: 'multiple_choice',
    statement,
    alternatives,
    correctAlternativeId,
  };
  const updatedQuiz: Quiz = {
    ...quiz,
    questions: [...(quiz.questions ?? []), question],
    updatedAt: new Date().toISOString(),
  };

  writeQuizzes(quizzes.map((storedQuiz) => (storedQuiz.id === quizId ? updatedQuiz : storedQuiz)));

  return { success: true, quiz: updatedQuiz };
}

export function editQuestion({
  quizId,
  questionId,
  statement,
  alternatives,
  correctAlternativeId,
}: EditQuestionParams): EditQuestionResult {
  const quizzes = readQuizzes();
  const quiz = quizzes.find((storedQuiz) => storedQuiz.id === quizId);

  if (!quiz) {
    return { success: false, reason: 'quizNotFound' };
  }

  if (!quiz.questions?.some((question) => question.id === questionId)) {
    return { success: false, reason: 'questionNotFound' };
  }

  const updatedQuiz: Quiz = {
    ...quiz,
    questions: quiz.questions.map((question) =>
      question.id === questionId ? { ...question, statement, alternatives, correctAlternativeId } : question,
    ),
    updatedAt: new Date().toISOString(),
  };

  writeQuizzes(quizzes.map((storedQuiz) => (storedQuiz.id === quizId ? updatedQuiz : storedQuiz)));

  return { success: true, quiz: updatedQuiz };
}

export function createQuiz({ authorId, title, description, difficulty }: CreateQuizParams): CreateQuizResult {
  const quizzes = readQuizzes();
  const now = new Date().toISOString();

  const quiz: Quiz = {
    id: crypto.randomUUID(),
    authorId,
    title,
    description,
    difficulty,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  writeQuizzes([...quizzes, quiz]);

  return { success: true, quiz };
}

export function editQuiz({ quizId, title, description, difficulty }: EditQuizParams): EditQuizResult {
  const quizzes = readQuizzes();
  const quiz = quizzes.find((storedQuiz) => storedQuiz.id === quizId);

  if (!quiz) {
    return { success: false, reason: 'quizNotFound' };
  }

  const editedQuiz: Quiz = {
    ...quiz,
    title,
    description,
    difficulty,
    updatedAt: new Date().toISOString(),
  };

  writeQuizzes(quizzes.map((storedQuiz) => (storedQuiz.id === quizId ? editedQuiz : storedQuiz)));

  return { success: true, quiz: editedQuiz };
}

export function deleteQuiz(quiz: Quiz): DeleteQuizResult {
  const quizzes = readQuizzes();
  const deletedQuiz: Quiz = {
    ...quiz,
    status: 'deleted',
    updatedAt: new Date().toISOString(),
  };

  writeQuizzes(quizzes.map((storedQuiz) => (storedQuiz.id === quiz.id ? deletedQuiz : storedQuiz)));

  return { success: true, quiz: deletedQuiz };
}
