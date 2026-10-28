import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { keyFromSelector } from 'i18next';
import { afterEach, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: keyFromSelector }),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
});
