import { useNavigate } from '@tanstack/react-router';
import { FileX as FileXIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';

export default function UnavailableState() {
  const { t } = useTranslation('myQuizzes');
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-7 sm:px-6 sm:py-9">
      <div
        className={`mx-auto flex w-full max-w-xl flex-col items-center rounded-2xl border border-border
          bg-linear-to-br from-card to-background px-4 py-10 text-center sm:px-6 sm:py-12`}
      >
        <span
          className={`mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-border bg-input
            text-muted-foreground`}
        >
          <FileXIcon aria-hidden className="size-7" />
        </span>

        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{t(($) => $.edit.unavailable.title)}</h1>

        <p className="mt-2 max-w-xs text-xs text-muted-foreground sm:text-sm">
          {t(($) => $.edit.unavailable.description)}
        </p>

        <Button className="mt-6" onClick={() => navigate({ to: '/my-quizzes' })}>
          {t(($) => $.edit.unavailable.action)}
        </Button>
      </div>
    </main>
  );
}
