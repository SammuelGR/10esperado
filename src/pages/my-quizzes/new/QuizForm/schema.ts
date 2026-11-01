import { z } from 'zod';

interface QuizValidationMessages {
  title: {
    required: string;
    length: string;
  };
  description: {
    length: string;
  };
}

export function createQuizSchema(messages: QuizValidationMessages) {
  return z.object({
    title: z
      .string({ error: messages.title.required })
      .trim()
      .min(1, { error: messages.title.required })
      .max(50, { error: messages.title.length }),
    description: z.string().max(1000, { error: messages.description.length }).optional(),
    difficulty: z.enum(['', 'easy', 'medium', 'hard']).optional(),
  });
}
