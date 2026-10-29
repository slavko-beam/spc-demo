import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Density, Theme } from '../ui/ui_store/ui_store.ts';
import { AppLayoutView } from './app.tsx';

describe('AppLayoutView', () => {
  const renderLayout = (theme: Theme, density: Density) =>
    render(
      <AppLayoutView
        theme={theme}
        density={density}
        navbar={<div>navbar slot</div>}
        sidebar={<div>sidebar slot</div>}
        main={<div>main slot</div>}
      />,
    );

  it('renders every slot', () => {
    renderLayout(Theme.LIGHT, Density.COMFORTABLE);

    expect(screen.getByText('navbar slot')).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toHaveTextContent('sidebar slot');
    expect(screen.getByRole('main')).toHaveTextContent('main slot');
  });

  it.each([
    [Theme.LIGHT, Density.COMFORTABLE, 'light', 'comfortable'],
    [Theme.DARK, Density.COMFORTABLE, 'dark', 'comfortable'],
    [Theme.LIGHT, Density.COMPACT, 'light', 'compact'],
    [Theme.DARK, Density.COMPACT, 'dark', 'compact'],
  ])('theme %s, density %s', (theme, density, themeAttribute, densityAttribute) => {
    const { container } = renderLayout(theme, density);

    expect(container.firstElementChild).toHaveAttribute('data-theme', themeAttribute);
    expect(container.firstElementChild).toHaveAttribute('data-density', densityAttribute);
  });
});
