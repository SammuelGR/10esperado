import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RegisterPage from './index';

vi.mock('./RegisterForm', () => ({
  default: () => <div data-testid="register-form-mock" />,
}));

describe('RegisterPage', () => {
  it('renders page content correctly', () => {
    render(<RegisterPage />);

    expect(screen.getByText('content.header.title')).toBeVisible();
    expect(screen.getByText('content.header.description')).toBeVisible();
    expect(screen.getByTestId('register-form-mock')).toBeInTheDocument();
  });
});
