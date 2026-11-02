import { z } from 'zod';

import type { ActiveQuiz } from '@/types/quiz';

interface QuizValidationMessages {
  title: {
    required: string;
    length: string;
  };
  description: {
    length: string;
  };
  difficulty: {
    required: string;
  };
}

export function createQuizSchema(messages: QuizValidationMessages, status: ActiveQuiz['status']) {
  return z.object({
    title: z
      .string({ error: messages.title.required })
      .trim()
      .min(1, { error: messages.title.required })
      .max(50, { error: messages.title.length }),
    description: z
      .string()
      .max(1000, { error: messages.description.length })
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
    difficulty: z
      .enum(['', 'easy', 'medium', 'hard'])
      .optional()
      .refine((value) => status !== 'published' || Boolean(value), { error: messages.difficulty.required }),
  });
}
