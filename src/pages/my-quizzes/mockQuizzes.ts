import type { QuizListEntry } from './QuizList/types';

export const mockQuizzes: QuizListEntry[] = [
  {
    id: 'demo-long-content',
    title: 'Revisão completa para provas finais e vestibulares',
    description:
      'Uma revisão abrangente dos principais conteúdos estudados ao longo do ano, com questões de matemática, história, geografia e ciências. Inclui exercícios contextualizados, interpretação de enunciados e situações que exigem relacionar diferentes assuntos para chegar à resposta.',
    difficulty: 'hard',
    status: 'draft',
    updatedAt: '2026-11-01T15:00:00.000Z',
  },
  {
    id: 'demo-unbroken-content',
    title: 'W'.repeat(50),
    description: 'ConteudoSemEspacos'.repeat(50),
    difficulty: 'medium',
    status: 'draft',
    updatedAt: '2026-10-31T15:00:00.000Z',
  },
  {
    id: 'demo-maximum-description',
    title: 'Descrição no limite de caracteres',
    description: 'Revisão com exercícios e explicações detalhadas. '.repeat(30).slice(0, 1000),
    difficulty: 'easy',
    status: 'draft',
    updatedAt: '2026-10-30T15:00:00.000Z',
  },
  {
    id: 'demo-history',
    title: 'História do Brasil',
    description: 'Questões sobre o período colonial e o império brasileiro.',
    difficulty: 'medium',
    status: 'published',
    updatedAt: '2026-10-28T17:32:00.000Z',
  },
  {
    id: 'demo-mathematics',
    title: 'Matemática Básica',
    description: 'Operações fundamentais, frações e porcentagem.',
    difficulty: 'easy',
    status: 'draft',
    updatedAt: '2026-10-27T12:15:00.000Z',
  },
  {
    id: 'demo-science',
    title: 'Ciência e Tecnologia',
    description: 'Invenções, descobertas e avanços científicos.',
    status: 'draft',
    updatedAt: '2026-10-25T19:20:00.000Z',
  },
  {
    id: 'demo-geography',
    title: 'Geografia Mundial',
    description: 'Países, capitais, continentes e características físicas.',
    difficulty: 'hard',
    status: 'published',
    updatedAt: '2026-10-24T14:08:00.000Z',
  },
  {
    id: 'demo-culture',
    title: 'Cultura Pop',
    description: 'Filmes, séries, música e curiosidades.',
    difficulty: 'easy',
    status: 'draft',
    updatedAt: '2026-10-22T22:41:00.000Z',
  },
];
