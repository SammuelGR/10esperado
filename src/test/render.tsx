import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

interface RouterRenderOptions {
  initialLocation?: string;
}

export function renderWithRouter(ui: ReactNode, { initialLocation = '/' }: RouterRenderOptions = {}) {
  const router = createRouter({
    routeTree: createRootRoute(),
    history: createMemoryHistory({ initialEntries: [initialLocation] }),
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <RouterContextProvider router={router}>{children}</RouterContextProvider>;
  }

  return { ...render(ui, { wrapper: Wrapper }), router };
}
