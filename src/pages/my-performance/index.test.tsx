import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { User } from '@/types/user';

import MyPerformancePage from './index';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: () => ({ user: fakeUser }),
}));

vi.mock('@/services/attempt', () => ({
  getAttemptsByUser: () => ({
    success: true,
    attempts: [],
    summary: { completedQuizzes: 0, answeredQuestions: 0, correctAnswers: 0, accuracyRate: 0 },
  }),
}));

vi.mock('./Summary', () => ({
  default: () => <div data-testid="summary-mock" />,
}));

vi.mock('./AttemptList', () => ({
  default: () => <div data-testid="attempt-list-mock" />,
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

describe('MyPerformancePage', () => {
  it('renders page content correctly', () => {
    render(<MyPerformancePage />);

    expect(screen.getByText('content.title')).toBeVisible();
    expect(screen.getByText('content.description')).toBeVisible();
    expect(screen.getByTestId('summary-mock')).toBeInTheDocument();
    expect(screen.getByTestId('attempt-list-mock')).toBeInTheDocument();
  });
});
