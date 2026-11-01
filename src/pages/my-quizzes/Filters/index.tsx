import { Search as SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Input, Select } from '@/components';

export default function Filters() {
  const { t } = useTranslation('myQuizzes');

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:w-1/2">
        <Input
          aria-label={t(($) => $.content.filters.search.label)}
          icon={<SearchIcon className="size-4" />}
          placeholder={t(($) => $.content.filters.search.placeholder)}
          type="search"
        />
      </div>

      <div className="w-full sm:w-44">
        <Select aria-label={t(($) => $.content.filters.status.label)} defaultValue="all">
          <option value="all">{t(($) => $.content.filters.status.options.all)}</option>

          <option value="draft">{t(($) => $.content.filters.status.options.draft)}</option>

          <option value="published">{t(($) => $.content.filters.status.options.published)}</option>
        </Select>
      </div>
    </div>
  );
}
