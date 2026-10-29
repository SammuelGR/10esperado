import { useNavigate } from '@tanstack/react-router';
import { TriangleAlert as TriangleAlertIcon } from 'lucide-react';
import type { RefObject } from 'react';
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@/components';
import { useAuth } from '@/contexts/AuthContext/useAuth';

interface ConfirmationDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
}

export default function ConfirmationDialog({ dialogRef }: ConfirmationDialogProps) {
  const { t } = useTranslation('account');
  const { deactivateAccount } = useAuth();
  const navigate = useNavigate();

  const [isDeactivating, setIsDeactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationInProgress = useRef(false);

  async function onConfirm() {
    if (confirmationInProgress.current) {
      return;
    }

    confirmationInProgress.current = true;
    setIsDeactivating(true);
    setError(null);

    try {
      const result = deactivateAccount();

      if (!result.success) {
        setError(t(($) => $.deactivation.confirmation.errors[result.reason]));
        return;
      }

      await navigate({ to: '/', replace: true });
    } catch {
      setError(t(($) => $.deactivation.confirmation.errors.failed));
    } finally {
      confirmationInProgress.current = false;
      setIsDeactivating(false);
    }
  }

  return (
    <dialog
      aria-busy={isDeactivating || undefined}
      aria-describedby="account-deactivation-warning account-deactivation-preservation"
      aria-labelledby="account-deactivation-dialog-title"
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto
        rounded-2xl border border-border bg-linear-to-br from-card to-background p-5 text-foreground shadow-2xl
        backdrop:bg-background/80 backdrop:backdrop-blur-sm sm:p-6`}
      onCancel={(event) => {
        if (confirmationInProgress.current) {
          event.preventDefault();
        }
      }}
      onClose={() => setError(null)}
      ref={dialogRef}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-error/50 bg-error/10">
          <TriangleAlertIcon aria-hidden className="size-5 text-error" />
        </span>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" id="account-deactivation-dialog-title">
          {t(($) => $.deactivation.confirmation.title)}
        </h2>
      </header>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground sm:text-sm" id="account-deactivation-warning">
        {t(($) => $.deactivation.confirmation.warning)}
      </p>

      <p
        className="mt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm"
        id="account-deactivation-preservation"
      >
        <Trans
          components={{ strong: <strong className="font-semibold text-foreground" /> }}
          i18nKey={($) => $.deactivation.confirmation.preservation}
          ns="account"
        />
      </p>

      {error && (
        <p className="mt-4 text-xs text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <form className="w-full sm:w-auto" method="dialog">
          <Button
            autoFocus
            className="w-full border border-border bg-input text-foreground enabled:hover:bg-card disabled:opacity-50"
            disabled={isDeactivating}
            type="submit"
          >
            {t(($) => $.deactivation.confirmation.cancel)}
          </Button>
        </form>

        <Button
          className="w-full bg-error text-background enabled:hover:bg-error/90 focus-visible:outline-error sm:w-auto"
          loading={isDeactivating}
          loadingText={t(($) => $.deactivation.confirmation.loading)}
          onClick={onConfirm}
          type="button"
        >
          {t(($) => $.deactivation.action)}
        </Button>
      </div>
    </dialog>
  );
}
