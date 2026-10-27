import { User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, PasswordInput } from '@/components';

export default function RegisterForm() {
  const { t } = useTranslation('register');
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword((visible) => !visible);
  }

  return (
    <form className="space-y-6">
      <FormField helper={t(($) => $.form.username.helper)} htmlFor="username" label={t(($) => $.form.username.label)}>
        <Input
          aria-describedby="username-message"
          autoComplete="username"
          icon={<UserIcon className="size-5" />}
          id="username"
          name="username"
          placeholder={t(($) => $.form.username.placeholder)}
          type="text"
        />
      </FormField>

      <FormField helper={t(($) => $.form.password.helper)} htmlFor="password" label={t(($) => $.form.password.label)}>
        <PasswordInput
          aria-describedby="password-message"
          autoComplete="new-password"
          id="password"
          name="password"
          onToggleVisibility={togglePasswordVisibility}
          placeholder={t(($) => $.form.password.placeholder)}
          visible={showPassword}
        />
      </FormField>

      <FormField htmlFor="confirm-password" label={t(($) => $.form.confirmPassword.label)}>
        <PasswordInput
          autoComplete="new-password"
          id="confirm-password"
          name="confirmPassword"
          onToggleVisibility={togglePasswordVisibility}
          placeholder={t(($) => $.form.confirmPassword.placeholder)}
          visible={showPassword}
        />
      </FormField>

      <Button className="mt-2 w-full" loadingText={t(($) => $.form.submit.loading)}>
        {t(($) => $.form.submit.label)}
      </Button>
    </form>
  );
}
