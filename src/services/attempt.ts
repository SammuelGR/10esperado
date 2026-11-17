import { STORAGE_KEYS } from '@/constants/storage';
import type { Attempt } from '@/types/attempt';

export interface CreateAttemptParams {
  userId: string;
  quizId: string;
  correct: number;
  incorrect: number;
  unanswered: number;
}

export type CreateAttemptResult = { success: true; attempt: Attempt } | { success: false; reason: 'invalidCounts' };

export interface AttemptSummary {
  completedQuizzes: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
}

type GetAttemptsByUserResult = {
  success: true;
  attempts: Attempt[];
  summary: AttemptSummary;
};

function readAttempts(): Attempt[] {
  const storedAttempts = localStorage.getItem(STORAGE_KEYS.attempts);

  return storedAttempts === null ? [] : (JSON.parse(storedAttempts) as Attempt[]);
}

function writeAttempts(attempts: Attempt[]): void {
  localStorage.setItem(STORAGE_KEYS.attempts, JSON.stringify(attempts));
}

export function createAttempt({
  userId,
  quizId,
  correct,
  incorrect,
  unanswered,
}: CreateAttemptParams): CreateAttemptResult {
  if (![correct, incorrect, unanswered].every((count) => Number.isInteger(count) && count >= 0)) {
    return { success: false, reason: 'invalidCounts' };
  }

  const attempts = readAttempts();
  const attempt: Attempt = {
    id: crypto.randomUUID(),
    userId,
    quizId,
    completedAt: new Date().toISOString(),
    correct,
    incorrect,
    unanswered,
  };

  writeAttempts([...attempts, attempt]);

  return { success: true, attempt };
}

export function getAttemptsByUser(userId: string): GetAttemptsByUserResult {
  const attempts = readAttempts()
    .filter((attempt) => attempt.userId === userId)
    .sort((first, second) => second.completedAt.localeCompare(first.completedAt));

  let answeredQuestions = 0;
  let correctAnswers = 0;

  for (const attempt of attempts) {
    answeredQuestions += attempt.correct + attempt.incorrect;
    correctAnswers += attempt.correct;
  }

  return {
    success: true,
    attempts,
    summary: {
      completedQuizzes: attempts.length,
      answeredQuestions,
      correctAnswers,
      accuracyRate: answeredQuestions === 0 ? 0 : correctAnswers / answeredQuestions,
    },
  };
}
