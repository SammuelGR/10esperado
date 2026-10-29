import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';

import ConfirmationDialog from './ConfirmationDialog';

export default function DeactivateAccountSection() {
  const { t } = useTranslation('account');
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openConfirmation() {
    dialogRef.current?.showModal();
  }

  return (
    <section
      aria-labelledby="account-deactivation-title"
      className={`flex flex-col gap-4 rounded-2xl border border-error/30 bg-error/5 p-4
        sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6`}
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight text-error sm:text-lg" id="account-deactivation-title">
          {t(($) => $.deactivation.title)}
        </h2>

        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {t(($) => $.deactivation.description)}
        </p>
      </div>

      <Button
        aria-haspopup="dialog"
        className={`w-full shrink-0 border border-error bg-transparent text-error
          enabled:hover:bg-error/10 focus-visible:outline-error sm:w-auto sm:px-5`}
        onClick={openConfirmation}
        type="button"
      >
        {t(($) => $.deactivation.action)}
      </Button>

      <ConfirmationDialog dialogRef={dialogRef} />
    </section>
  );
}
