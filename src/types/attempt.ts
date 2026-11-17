export interface Attempt {
  id: string;
  userId: string;
  quizId: string;
  completedAt: string;
  correct: number;
  incorrect: number;
  unanswered: number;
}
