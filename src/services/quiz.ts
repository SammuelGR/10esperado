import { STORAGE_KEYS } from '@/constants/storage';
import type { Quiz } from '@/types/quiz';

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
