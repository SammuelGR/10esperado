import { Link } from '@tanstack/react-router';
import { Plus as PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MyQuizzesPage() {
  const { t } = useTranslation('myQuizzes');

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
    </main>
  );
}
