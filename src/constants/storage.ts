const APP_STORAGE_PREFIX = '10esperado:';

export const STORAGE_KEYS = {
  users: `${APP_STORAGE_PREFIX}users`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
