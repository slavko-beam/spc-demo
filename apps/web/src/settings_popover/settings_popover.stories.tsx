import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Density, Theme } from '../ui/ui_store/ui_store.ts';
import { SettingsPopoverView } from './settings_popover.tsx';

const meta = {
  component: SettingsPopoverView,
  parameters: { layout: 'centered' },
  args: {
    isOpen: false,
    theme: Theme.LIGHT,
    density: Density.COMFORTABLE,
    onToggleOpen: fn(),
    onClose: fn(),
    onThemeChange: fn(),
    onDensityChange: fn(),
  },
} satisfies Meta<typeof SettingsPopoverView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Open: Story = { args: { isOpen: true } };
export const OpenDarkCompact: Story = {
  args: { isOpen: true, theme: Theme.DARK, density: Density.COMPACT },
};
