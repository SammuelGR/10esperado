import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import account from '@/locales/pt-BR/account.json';
import common from '@/locales/pt-BR/common.json';
import home from '@/locales/pt-BR/home.json';
import login from '@/locales/pt-BR/login.json';
import myQuizzes from '@/locales/pt-BR/myQuizzes.json';
import register from '@/locales/pt-BR/register.json';

export const resources = {
  'pt-BR': {
    account,
    common,
    home,
    login,
    myQuizzes,
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
