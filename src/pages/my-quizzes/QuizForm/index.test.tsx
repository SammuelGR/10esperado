import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import QuizForm from './index';

const fakeQuizValues = {
  title: 'Example quiz',
  description: 'Example quiz description',
  difficulty: 'medium',
} as const;

const fakeOnSubmit = vi.fn();

describe('QuizForm', () => {
  beforeEach(() => {
    fakeOnSubmit.mockReset();
  });

  it('renders form content correctly', () => {
    render(<QuizForm mode="new" onCancel={vi.fn()} onSubmit={fakeOnSubmit} status="draft" />);

    expect(screen.getByText('form.title')).toBeVisible();
    expect(screen.getByText('content.list.status.draft')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'form.quizTitle.label' })).toHaveAttribute(
      'placeholder',
      'form.quizTitle.placeholder',
    );
    expect(screen.getByRole('textbox', { name: 'form.description.label' })).toHaveAttribute(
      'placeholder',
      'form.description.placeholder',
    );
    expect(screen.getByText('form.quizTitle.helper')).toBeVisible();
    expect(screen.getByText('form.description.helper')).toBeVisible();
    expect(screen.getByText('form.difficulty.helper')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'form.difficulty.label' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'form.difficulty.placeholder' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'form.difficulty.options.easy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'form.difficulty.options.medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'form.difficulty.options.hard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'form.actions.cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'new.form.submit.label' })).toBeVisible();
  });

  it('submits the trimmed metadata', async () => {
    const user = userEvent.setup();

    render(<QuizForm mode="new" onCancel={vi.fn()} onSubmit={fakeOnSubmit} status="draft" />);

    await user.type(screen.getByRole('textbox', { name: 'form.quizTitle.label' }), `  ${fakeQuizValues.title}  `);
    await user.type(screen.getByRole('textbox', { name: 'form.description.label' }), fakeQuizValues.description);
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'form.difficulty.label' }),
      fakeQuizValues.difficulty,
    );
    await user.click(screen.getByRole('button', { name: 'new.form.submit.label' }));

    await waitFor(() => {
      expect(fakeOnSubmit).toHaveBeenCalledExactlyOnceWith(fakeQuizValues);
    });
  });

  it.each([
    {
      scenario: 'title is empty',
      overrides: { title: '' },
      field: 'quizTitle',
      message: 'form.quizTitle.errors.required',
    },
    {
      scenario: 'title contains only whitespace',
      overrides: { title: '   ' },
      field: 'quizTitle',
      message: 'form.quizTitle.errors.required',
    },
    {
      scenario: 'title is too long',
      overrides: { title: 'a'.repeat(51) },
      field: 'quizTitle',
      message: 'form.quizTitle.errors.length',
    },
    {
      scenario: 'description is too long',
      overrides: { description: 'a'.repeat(1001) },
      field: 'description',
      message: 'form.description.errors.length',
    },
  ] as const)('shows the validation message when $scenario', async ({ overrides, field, message }) => {
    const user = userEvent.setup();
    const values = { ...fakeQuizValues, ...overrides };

    render(<QuizForm mode="new" onCancel={vi.fn()} onSubmit={fakeOnSubmit} status="draft" />);

    if (values.title) {
      await user.type(screen.getByRole('textbox', { name: 'form.quizTitle.label' }), values.title);
    }

    await user.type(screen.getByRole('textbox', { name: 'form.description.label' }), values.description);
    await user.click(screen.getByRole('button', { name: 'new.form.submit.label' }));

    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.getByRole('textbox', { name: `form.${field}.label` })).toHaveAccessibleDescription(message);
    expect(fakeOnSubmit).not.toHaveBeenCalled();
  });

  it('shows a submission error when submitting throws', async () => {
    const user = userEvent.setup();

    fakeOnSubmit.mockImplementation(() => {
      throw new Error('Fake submission error');
    });

    render(<QuizForm mode="new" onCancel={vi.fn()} onSubmit={fakeOnSubmit} status="draft" />);

    await user.type(screen.getByRole('textbox', { name: 'form.quizTitle.label' }), fakeQuizValues.title);
    await user.click(screen.getByRole('button', { name: 'new.form.submit.label' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('new.form.submit.errors.failed');
  });

  it('shows loading and disables the controls while submission is pending', async () => {
    const user = userEvent.setup();

    fakeOnSubmit.mockReturnValue(new Promise<void>(() => {}));

    render(<QuizForm mode="new" onCancel={vi.fn()} onSubmit={fakeOnSubmit} status="draft" />);

    expect(screen.getByText('new.form.submit.label')).toBeVisible();
    expect(screen.queryByText('new.form.submit.loading')).not.toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'form.quizTitle.label' }), fakeQuizValues.title);
    await user.click(screen.getByRole('button', { name: 'new.form.submit.label' }));

    expect(await screen.findByRole('button', { name: 'new.form.submit.loading' })).toBeDisabled();
    expect(screen.queryByText('new.form.submit.label')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'form.quizTitle.label' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'form.description.label' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'form.difficulty.label' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'form.actions.cancel' })).toBeDisabled();
  });

  it('requires difficulty when editing a published quiz', async () => {
    const user = userEvent.setup();

    render(
      <QuizForm
        defaultValues={fakeQuizValues}
        mode="edit"
        onCancel={vi.fn()}
        onSubmit={fakeOnSubmit}
        status="published"
      />,
    );

    await user.selectOptions(screen.getByRole('combobox', { name: 'form.difficulty.label' }), '');
    await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

    expect(await screen.findByText('form.difficulty.errors.required')).toBeVisible();
    expect(fakeOnSubmit).not.toHaveBeenCalled();

    await user.selectOptions(screen.getByRole('combobox', { name: 'form.difficulty.label' }), 'hard');
    await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

    await waitFor(() => {
      expect(fakeOnSubmit).toHaveBeenCalledExactlyOnceWith({ ...fakeQuizValues, difficulty: 'hard' });
    });
    expect(screen.queryByText('form.difficulty.errors.required')).not.toBeInTheDocument();
  });

  it('submits cleared optional fields as undefined when editing a draft', async () => {
    const user = userEvent.setup();

    render(
      <QuizForm defaultValues={fakeQuizValues} mode="edit" onCancel={vi.fn()} onSubmit={fakeOnSubmit} status="draft" />,
    );

    await user.clear(screen.getByRole('textbox', { name: 'form.description.label' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'form.difficulty.label' }), '');
    await user.click(screen.getByRole('button', { name: 'edit.form.submit.label' }));

    await waitFor(() => {
      expect(fakeOnSubmit).toHaveBeenCalledExactlyOnceWith({
        title: fakeQuizValues.title,
        description: undefined,
        difficulty: undefined,
      });
    });
  });
});
