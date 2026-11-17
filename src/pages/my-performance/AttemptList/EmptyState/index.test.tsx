import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmptyState from './index';

describe('EmptyState', () => {
  it('renders empty state content correctly', () => {
    render(<EmptyState />);

    expect(screen.getByRole('heading', { name: 'content.list.empty.title' })).toBeVisible();
    expect(screen.getByText('content.list.empty.description')).toBeVisible();
  });
});
