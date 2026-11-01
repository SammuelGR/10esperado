const APP_STORAGE_PREFIX = '10esperado:';

export const STORAGE_KEYS = {
  quizzes: `${APP_STORAGE_PREFIX}quizzes`,
  session: `${APP_STORAGE_PREFIX}session`,
  users: `${APP_STORAGE_PREFIX}users`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
