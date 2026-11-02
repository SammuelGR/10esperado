import { z } from 'zod';

interface QuestionValidationMessages {
  statement: string;
  alternative: string;
  minimumAlternatives: string;
  correctAlternative: string;
}

export function createQuestionSchema(messages: QuestionValidationMessages) {
  return z
    .object({
      statement: z.string().trim().min(1, { error: messages.statement }),
      alternatives: z
        .array(
          z.object({
            id: z.string().min(1),
            text: z.string().trim().min(1, { error: messages.alternative }),
          }),
        )
        .min(2, { error: messages.minimumAlternatives }),
      correctAlternativeId: z
        .string({ error: messages.correctAlternative })
        .min(1, { error: messages.correctAlternative }),
    })
    .refine(({ alternatives, correctAlternativeId }) => alternatives.some(({ id }) => id === correctAlternativeId), {
      path: ['correctAlternativeId'],
      error: messages.correctAlternative,
    });
}
