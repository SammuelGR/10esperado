import { z } from 'zod';

interface RegisterValidationMessages {
  username: {
    required: string;
    length: string;
    invalidCharacters: string;
  };
  password: {
    required: string;
    length: string;
    invalidCharacters: string;
  };
  confirmPassword: {
    required: string;
    mismatch: string;
  };
}

export function createRegisterSchema(messages: RegisterValidationMessages) {
  return z
    .object({
      username: z
        .string()
        .min(1, { error: messages.username.required })
        .min(3, { error: messages.username.length })
        .max(24, { error: messages.username.length })
        .refine((value) => !/\W/.test(value), {
          error: messages.username.invalidCharacters,
        }),
      password: z
        .string()
        .min(1, { error: messages.password.required })
        .min(6, { error: messages.password.length })
        .max(64, { error: messages.password.length })
        .refine((value) => !/[^\x20-\x7E]/.test(value), {
          error: messages.password.invalidCharacters,
        }),
      confirmPassword: z.string().min(1, { error: messages.confirmPassword.required }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      error: messages.confirmPassword.mismatch,
      path: ['confirmPassword'],
    });
}
