import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { AttemptSummary } from '@/services/attempt';
import { percentFormatter } from '@/utils/formatters/number';

import Summary from './index';

const fakeSummary: AttemptSummary = {
  completedQuizzes: 3,
  answeredQuestions: 20,
  correctAnswers: 15,
  accuracyRate: 0.75,
};

describe('Summary', () => {
  it('renders summary content correctly', () => {
    render(<Summary summary={fakeSummary} />);

    expect(screen.getByText('content.summary.completedQuizzes')).toBeVisible();
    expect(screen.getByText(String(fakeSummary.completedQuizzes))).toBeVisible();
    expect(screen.getByText('content.summary.answeredQuestions')).toBeVisible();
    expect(screen.getByText(String(fakeSummary.answeredQuestions))).toBeVisible();
    expect(screen.getByText('content.summary.correctAnswers')).toBeVisible();
    expect(screen.getByText(String(fakeSummary.correctAnswers))).toBeVisible();
    expect(screen.getByText('content.summary.accuracyRate')).toBeVisible();
    expect(screen.getByText(percentFormatter.format(fakeSummary.accuracyRate))).toBeVisible();
  });
});
