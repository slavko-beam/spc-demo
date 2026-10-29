import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ListSidebarItemView } from './list_sidebar_item.tsx';

const meta = {
  component: ListSidebarItemView,
  decorators: [(Story) => <ul style={{ listStyle: 'none', padding: 0, width: 220 }}>{Story()}</ul>],
  args: { id: 1, name: 'Groceries', openCount: 4, isSelected: false, onSelect: fn() },
} satisfies Meta<typeof ListSidebarItemView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { isSelected: true } };
export const NothingOpen: Story = { args: { openCount: 0 } };
