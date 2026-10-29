import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { Density, Theme } from '../ui/ui_store/ui_store.ts';
import { SettingsPopoverView } from './settings_popover.tsx';

describe('SettingsPopoverView', () => {
  let onToggleOpen: Mock<() => void>;
  let onClose: Mock<() => void>;
  let onThemeChange: Mock<(theme: Theme) => void>;
  let onDensityChange: Mock<(density: Density) => void>;

  beforeEach(() => {
    onToggleOpen = vi.fn();
    onClose = vi.fn();
    onThemeChange = vi.fn();
    onDensityChange = vi.fn();
  });

  const renderPopover = (isOpen: boolean) =>
    render(
      <SettingsPopoverView
        isOpen={isOpen}
        theme={Theme.LIGHT}
        density={Density.COMFORTABLE}
        onToggleOpen={onToggleOpen}
        onClose={onClose}
        onThemeChange={onThemeChange}
        onDensityChange={onDensityChange}
      />,
    );

  it('hides the panel when closed', async () => {
    renderPopover(false);

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onToggleOpen).toHaveBeenCalled();
  });

  it('reports theme and density changes as enums', async () => {
    renderPopover(true);

    await userEvent.selectOptions(screen.getByLabelText('Theme'), 'Dark');
    await userEvent.selectOptions(screen.getByLabelText('Density'), 'Compact');

    expect(onThemeChange).toHaveBeenCalledWith(Theme.DARK);
    expect(onDensityChange).toHaveBeenCalledWith(Density.COMPACT);
  });

  it('closes on escape', async () => {
    renderPopover(true);

    await userEvent.type(screen.getByLabelText('Theme'), '{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});
