import { STORAGE_KEYS } from '@/constants/storage';
import type { ActiveQuiz, Quiz } from '@/types/quiz';

interface CreateQuizParams {
  authorId: string;
  title: string;
  description?: string;
  difficulty?: NonNullable<Quiz['difficulty']>;
}

type CreateQuizResult = { success: true; quiz: Quiz };

type GetActiveQuizzesByAuthorResult = { success: true; quizzes: ActiveQuiz[] };

function readQuizzes(): Quiz[] {
  const storedQuizzes = localStorage.getItem(STORAGE_KEYS.quizzes);

  return storedQuizzes === null ? [] : (JSON.parse(storedQuizzes) as Quiz[]);
}

function writeQuizzes(quizzes: Quiz[]): void {
  localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(quizzes));
}

export function getActiveQuizzesByAuthor(authorId: string): GetActiveQuizzesByAuthorResult {
  const quizzes = readQuizzes()
    .filter(
      (quiz): quiz is ActiveQuiz =>
        quiz.authorId === authorId && (quiz.status === 'draft' || quiz.status === 'published'),
    )
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));

  return { success: true, quizzes };
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
