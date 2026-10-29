import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon } from 'lucide-react';
import type { SubmitEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input } from '@/components';

import { createUsernameSchema } from '../schema';

interface UsernameFormProps {
  username: string;
}

export default function UsernameForm({ username }: UsernameFormProps) {
  const { t } = useTranslation('account');

  const schema = createUsernameSchema({
    username: {
      required: t(($) => $.username.errors.required),
      length: t(($) => $.username.errors.length),
      invalidCharacters: t(($) => $.username.errors.invalidCharacters),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const submitForm = handleSubmit(() => undefined);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitForm();
  }

  return (
    <form
      aria-labelledby="account-username-title"
      className="rounded-2xl border border-border bg-linear-to-br from-card to-background p-4 sm:p-6"
      noValidate
      onSubmit={onSubmit}
    >
      <h2 className="text-base font-semibold tracking-tight sm:text-lg" id="account-username-title">
        {t(($) => $.username.title)}
      </h2>

      <dl className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm">
        <dt className="text-muted-foreground">{t(($) => $.username.current)}</dt>

        <dd>{username}</dd>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <FormField
          error={errors.username?.message}
          helper={t(($) => $.username.helper)}
          htmlFor="account-username"
          label={t(($) => $.username.label)}
        >
          <Input
            {...register('username')}
            aria-describedby="account-username-message"
            aria-invalid={Boolean(errors.username)}
            autoComplete="username"
            icon={<UserIcon className="size-4" />}
            id="account-username"
            placeholder={t(($) => $.username.placeholder)}
            type="text"
          />
        </FormField>

        <Button className="w-full sm:mt-5 sm:w-40" type="submit">
          {t(($) => $.username.action)}
        </Button>
      </div>
    </form>
  );
}
