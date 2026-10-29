import { z } from 'zod';

interface UsernameValidationMessages {
  username: {
    required: string;
    length: string;
    invalidCharacters: string;
  };
}

interface PasswordValidationMessages {
  currentPassword: {
    required: string;
  };
  newPassword: {
    required: string;
    length: string;
    invalidCharacters: string;
  };
  confirmPassword: {
    required: string;
    mismatch: string;
  };
}

export function createUsernameSchema(messages: UsernameValidationMessages) {
  return z.object({
    username: z
      .string()
      .min(1, { error: messages.username.required })
      .min(3, { error: messages.username.length })
      .max(24, { error: messages.username.length })
      .refine((value) => !/\W/.test(value), {
        error: messages.username.invalidCharacters,
      }),
  });
}

export function createPasswordSchema(messages: PasswordValidationMessages) {
  return z
    .object({
      currentPassword: z.string().min(1, { error: messages.currentPassword.required }),
      newPassword: z
        .string()
        .min(1, { error: messages.newPassword.required })
        .min(6, { error: messages.newPassword.length })
        .max(64, { error: messages.newPassword.length })
        .refine((value) => !/[^\x20-\x7E]/.test(value), {
          error: messages.newPassword.invalidCharacters,
        }),
      confirmPassword: z.string().min(1, { error: messages.confirmPassword.required }),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      error: messages.confirmPassword.mismatch,
      path: ['confirmPassword'],
    });
}
