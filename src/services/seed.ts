import { SEED_QUIZZES, SEED_USERS } from '@/mocks/seed';

import { addQuestion, createQuiz, publishQuiz } from './quiz';
import { createUser, findUserByUsername } from './user';

export async function seedDemoData(currentUserId: string): Promise<void> {
  const authorIds: Record<string, string> = { currentUser: currentUserId };

  await Promise.all(
    SEED_USERS.map(async (credentials) => {
      const result = await createUser(credentials);
      const author = result.success ? result.user : findUserByUsername(credentials.username);

      if (!author) {
        throw new Error(`Seed author not found: ${credentials.username}`);
      }

      authorIds[credentials.username] = author.id;
    }),
  );

  for (const { author, title, description, difficulty, status, questions } of SEED_QUIZZES) {
    const authorId = authorIds[author];

    if (!authorId) {
      throw new Error(`Seed author not found: ${author}`);
    }

    const { quiz } = createQuiz({ authorId, title, description, difficulty });

    for (const { statement, alternatives: texts, correctAlternativeIndex } of questions) {
      const alternatives = texts.map((text) => ({ id: crypto.randomUUID(), text }));
      const correctAlternative = alternatives[correctAlternativeIndex];

      if (!correctAlternative) {
        throw new Error(`Seed answer not found: ${statement}`);
      }

      addQuestion({ quizId: quiz.id, statement, alternatives, correctAlternativeId: correctAlternative.id });
    }

    if (status === 'published') {
      publishQuiz(quiz.id);
    }
  }
}
