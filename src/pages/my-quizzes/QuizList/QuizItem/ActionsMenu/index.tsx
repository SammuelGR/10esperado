import { Ellipsis as EllipsisIcon, Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

interface ActionsMenuProps {
  title: string;
}

export default function ActionsMenu({ title }: ActionsMenuProps) {
  const { t } = useTranslation('myQuizzes');
  const popoverId = useId();

  return (
    <div className="col-start-2 row-start-1 -mt-2 -mr-2 justify-self-end md:col-start-5 md:m-0">
      <button
        aria-label={t(($) => $.content.list.actions.label, { title })}
        className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
          transition-colors hover:bg-input hover:text-foreground focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-primary`}
        popoverTarget={popoverId}
        type="button"
      >
        <EllipsisIcon aria-hidden className="size-5" />
      </button>

      <div
        className={`fixed inset-auto top-[anchor(bottom)] right-[anchor(right)] m-0 mt-1 w-44
          max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card p-1.5 text-foreground shadow-xl
          [position-anchor:auto]`}
        id={popoverId}
        popover="auto"
      >
        <button
          className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs
            transition-colors hover:bg-input focus-visible:outline-2 focus-visible:-outline-offset-2
            focus-visible:outline-primary`}
          type="button"
        >
          <PencilIcon aria-hidden className="size-3.5 shrink-0" />

          {t(($) => $.content.list.actions.edit)}
        </button>

        <hr className="my-0.5 border-border" />

        <button
          className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs text-error
            transition-colors hover:bg-error/10 focus-visible:outline-2 focus-visible:-outline-offset-2
            focus-visible:outline-error`}
          type="button"
        >
          <TrashIcon aria-hidden className="size-3.5 shrink-0" />

          {t(($) => $.content.list.actions.delete)}
        </button>
      </div>
    </div>
  );
}
