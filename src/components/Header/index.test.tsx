import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Header from './index';

describe('Header', () => {
  it('renders header content correctly', () => {
    render(<Header />);

    expect(screen.getByText('content.header.logo.prefix')).toBeVisible();
    expect(screen.getByText('content.header.logo.name')).toBeVisible();
  });
});
