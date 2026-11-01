import { Link } from '@tanstack/react-router';
import { Plus as PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { getActiveQuizzesByAuthor } from '@/services/quiz';
import type { ActiveQuiz } from '@/types/quiz';

import Filters from './Filters';
import QuizList from './QuizList';

export default function MyQuizzesPage() {
  const { t } = useTranslation('myQuizzes');
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ActiveQuiz['status']>('all');

  const result = user ? getActiveQuizzesByAuthor(user.id) : null;
  const quizzes = result?.quizzes ?? [];
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
    const matchesStatus = status === 'all' || quiz.status === status;

    return matchesSearch && matchesStatus;
  });

  function clearFilters() {
    setSearch('');
    setStatus('all');
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.content.title)}</h1>

          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t(($) => $.content.description)}</p>
        </div>

        <Link
          className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4
            py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto`}
          to="/my-quizzes/new"
        >
          <PlusIcon aria-hidden className="size-4 shrink-0" />

          {t(($) => $.content.actions.newQuiz)}
        </Link>
      </header>

      <Filters onSearchChange={setSearch} onStatusChange={setStatus} search={search} status={status} />

      <QuizList
        emptyState={quizzes.length === 0 ? 'empty' : 'noResults'}
        onClearFilters={clearFilters}
        quizzes={filteredQuizzes}
        totalCount={quizzes.length}
      />
    </main>
  );
}
