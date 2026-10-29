import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TodoFilter } from '../todos_store/todos_store.ts';
import { TodoToolbarView } from './todo_toolbar.tsx';

const meta = {
  component: TodoToolbarView,
  args: {
    filter: TodoFilter.ALL,
    search: '',
    activeCount: 2,
    completedCount: 1,
    onFilterChange: fn(),
    onSearchChange: fn(),
  },
} satisfies Meta<typeof TodoToolbarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};
export const Active: Story = { args: { filter: TodoFilter.ACTIVE } };
export const Completed: Story = { args: { filter: TodoFilter.COMPLETED } };
export const Searching: Story = { args: { search: 'milk' } };
