import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation('common');

  return (
    <header className="shrink-0 border-b border-border">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center px-4 sm:min-h-20 sm:px-6">
        <span className="text-2xl font-bold tracking-tighter sm:text-3xl">
          <span className="text-primary">{t(($) => $.content.header.logo.prefix)}</span>

          <span>{t(($) => $.content.header.logo.name)}</span>
        </span>
      </div>
    </header>
  );
}
