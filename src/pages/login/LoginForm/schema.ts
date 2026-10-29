import { z } from 'zod';

interface LoginValidationMessages {
  username: {
    required: string;
  };
  password: {
    required: string;
  };
}

export function createLoginSchema(messages: LoginValidationMessages) {
  return z.object({
    username: z.string().min(1, { error: messages.username.required }),
    password: z.string().min(1, { error: messages.password.required }),
  });
}
