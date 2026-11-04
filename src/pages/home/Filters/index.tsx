import { Search as SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Input, Select } from '@/components';
import type { Quiz } from '@/types/quiz';

interface FiltersProps {
  search: string;
  difficulty: 'all' | NonNullable<Quiz['difficulty']>;
  onSearchChange: (search: string) => void;
  onDifficultyChange: (difficulty: FiltersProps['difficulty']) => void;
}

export default function Filters({ search, difficulty, onSearchChange, onDifficultyChange }: FiltersProps) {
  const { t } = useTranslation('home');

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:w-1/2">
        <Input
          aria-label={t(($) => $.content.filters.search.label)}
          icon={<SearchIcon className="size-4" />}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t(($) => $.content.filters.search.placeholder)}
          type="search"
          value={search}
        />
      </div>

      <div className="w-full sm:w-52">
        <Select
          aria-label={t(($) => $.content.filters.difficulty.label)}
          onChange={(event) => onDifficultyChange(event.target.value as FiltersProps['difficulty'])}
          value={difficulty}
        >
          <option value="all">{t(($) => $.content.filters.difficulty.options.all)}</option>

          <option value="easy">{t(($) => $.content.filters.difficulty.options.easy)}</option>

          <option value="medium">{t(($) => $.content.filters.difficulty.options.medium)}</option>

          <option value="hard">{t(($) => $.content.filters.difficulty.options.hard)}</option>
        </Select>
      </div>
    </div>
  );
}
