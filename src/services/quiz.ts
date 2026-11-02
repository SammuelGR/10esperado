import { STORAGE_KEYS } from '@/constants/storage';
import type { Quiz } from '@/types/quiz';

export interface CreateQuizParams {
  authorId: string;
  title: string;
  description?: string;
  difficulty?: NonNullable<Quiz['difficulty']>;
}

export type CreateQuizResult = { success: true; quiz: Quiz };

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
