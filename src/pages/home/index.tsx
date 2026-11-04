import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import { getUsers } from '@/services/user';
import type { Quiz } from '@/types/quiz';

import EmptyState from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';
import Filters from './Filters';
import QuizList from './QuizList';

export default function HomePage() {
  const { t } = useTranslation('home');

  const { user } = useAuth();
  const { quizzes } = useQuiz();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | NonNullable<Quiz['difficulty']>>('all');

  const users = getUsers();

  const publishedQuizzes = quizzes
    .filter((quiz) => quiz.status === 'published')
    .map((quiz) => ({
      quiz,
      username: users.find((author) => author.id === quiz.authorId)?.username ?? t(($) => $.content.list.unknownAuthor),
    }));

  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
  const filteredQuizzes = publishedQuizzes.filter(({ quiz }) => {
    const matchesSearch = quiz.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
    const matchesDifficulty = difficulty === 'all' || quiz.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
  });

  let emptyStateVariant: EmptyStateVariant | null = null;

  if (publishedQuizzes.length === 0) {
    emptyStateVariant = user ? 'authenticated' : 'visitor';
  } else if (filteredQuizzes.length === 0) {
    emptyStateVariant = 'noResults';
  }

  function clearFilters() {
    setSearch('');
    setDifficulty('all');
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.content.title)}</h1>

        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t(($) => $.content.description)}</p>
      </header>

      <Filters difficulty={difficulty} onDifficultyChange={setDifficulty} onSearchChange={setSearch} search={search} />

      {emptyStateVariant ? (
        <EmptyState onClearFilters={clearFilters} variant={emptyStateVariant} />
      ) : (
        <QuizList quizzes={filteredQuizzes} />
      )}
    </main>
  );
}
