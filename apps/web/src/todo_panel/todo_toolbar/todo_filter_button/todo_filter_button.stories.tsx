import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TodoFilter } from '../../todos_store/todos_store.ts';
import { TodoFilterButtonView } from './todo_filter_button.tsx';

const meta = {
  component: TodoFilterButtonView,
  args: { filter: TodoFilter.ACTIVE, label: 'Active (2)', isActive: false, onSelect: fn() },
} satisfies Meta<typeof TodoFilterButtonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {};
export const Active: Story = { args: { isActive: true } };
