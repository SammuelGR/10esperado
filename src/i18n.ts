import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from '@/locales/pt-BR/common.json';
import register from '@/locales/pt-BR/register.json';

export const resources = {
  'pt-BR': {
    common,
    register,
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  defaultNS: 'register',
  interpolation: {
    escapeValue: false,
  },
});
