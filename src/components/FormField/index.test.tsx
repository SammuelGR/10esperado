import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FormField from './index';

describe('FormField', () => {
  it('renders field correctly', () => {
    render(
      <FormField helper="Fake helper" htmlFor="fake-field" label="Fake label">
        <input id="fake-field" />
      </FormField>,
    );

    expect(screen.getByText('Fake label')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Fake label' })).toBeVisible();
    expect(screen.getByText('Fake helper')).toBeVisible();
  });

  it('replaces helper with error', () => {
    const { rerender } = render(
      <FormField helper="Fake helper" htmlFor="fake-field" label="Fake label">
        <input id="fake-field" />
      </FormField>,
    );

    expect(screen.getByText('Fake helper')).toBeVisible();
    expect(screen.queryByText('Fake error')).not.toBeInTheDocument();

    rerender(
      <FormField error="Fake error" helper="Fake helper" htmlFor="fake-field" label="Fake label">
        <input id="fake-field" />
      </FormField>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Fake error');
    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.queryByText('Fake helper')).not.toBeInTheDocument();
  });
});
