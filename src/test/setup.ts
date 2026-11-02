import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { keyFromSelector } from 'i18next';
import { afterEach, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: keyFromSelector }),
  Trans: ({ i18nKey }: { i18nKey: Parameters<typeof keyFromSelector>[0] }) => keyFromSelector(i18nKey),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
});
