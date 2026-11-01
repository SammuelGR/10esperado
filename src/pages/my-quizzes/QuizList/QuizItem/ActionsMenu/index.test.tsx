import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ActionsMenu from './index';

describe('ActionsMenu', () => {
  it('renders action menu content correctly', () => {
    render(<ActionsMenu title="Example quiz" />);

    expect(screen.getByRole('button', { name: 'content.list.actions.label' })).toBeVisible();
    expect(screen.getByText('content.list.actions.edit')).toBeInTheDocument();
    expect(screen.getByText('content.list.actions.delete')).toBeInTheDocument();
  });
});
