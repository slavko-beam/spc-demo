import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileNavbarView } from './mobile_navbar.tsx';

const meta = {
  component: MobileNavbarView,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  // Any element can fill the slot, so stories don't need the real popover's stores.
  args: { listName: 'Groceries', settingsPopover: <button type="button">Settings</button> },
} satisfies Meta<typeof MobileNavbarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithList: Story = {};
export const NoList: Story = { args: { listName: undefined } };
