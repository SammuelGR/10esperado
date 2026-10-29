import { Link } from '@tanstack/react-router';
import { ChevronDown as ChevronDownIcon, LogOut as LogOutIcon, Menu as MenuIcon, User as UserIcon } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';

export default function UserMenu() {
  const { t } = useTranslation('common');
  const { user, logout } = useAuth();
  const popoverId = useId();

  if (!user) {
    return null;
  }

  return (
    <div>
      <button
        aria-label={t(($) => $.content.header.userMenu.label, { username: user.username })}
        className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground
          transition-colors hover:bg-input focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-primary`}
        popoverTarget={popoverId}
        type="button"
      >
        <MenuIcon aria-hidden className="size-5 sm:hidden" />

        <span className="hidden max-w-48 truncate sm:inline">{user.username}</span>

        <ChevronDownIcon aria-hidden className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
      </button>

      <div
        className={`fixed inset-auto top-[anchor(bottom)] right-[anchor(right)] m-0 mt-2 w-48
          max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card p-2 text-foreground shadow-xl
          [position-anchor:auto]`}
        id={popoverId}
        popover="auto"
      >
        <Link
          className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm
            transition-colors hover:bg-input focus-visible:bg-input focus-visible:outline-2
            focus-visible:-outline-offset-2 focus-visible:outline-primary`}
          to="/account"
        >
          <UserIcon aria-hidden className="size-4 shrink-0" />

          {t(($) => $.content.header.actions.account)}
        </Link>

        <button
          className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm
            transition-colors hover:bg-input focus-visible:bg-input focus-visible:outline-2
            focus-visible:-outline-offset-2 focus-visible:outline-primary`}
          onClick={logout}
          type="button"
        >
          <LogOutIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />

          {t(($) => $.content.header.actions.logout)}
        </button>
      </div>
    </div>
  );
}
