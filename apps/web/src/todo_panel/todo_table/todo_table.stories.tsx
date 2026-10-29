import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LoadStatus } from '../../lib/load_status.ts';
import { todoFixture } from '../../test/fixtures.ts';
import { TodoTableView } from './todo_table.tsx';

const todos = [
  todoFixture({ id: 1, title: 'Oat milk' }),
  todoFixture({ id: 2, title: 'Sourdough', completed: true }),
  todoFixture({ id: 3, title: 'Lemons' }),
];

const meta = {
  component: TodoTableView,
  args: {
    todos,
    status: LoadStatus.LOADED,
    selectedIds: new Set<number>(),
    isAllSelected: false,
    onToggleSelected: fn(),
    onToggleSelectAll: fn(),
    onToggleCompleted: fn(),
  },
} satisfies Meta<typeof TodoTableView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {};
export const SomeSelected: Story = { args: { selectedIds: new Set([1, 3]) } };
export const AllSelected: Story = {
  args: { selectedIds: new Set([1, 2, 3]), isAllSelected: true },
};
export const Empty: Story = { args: { todos: [] } };
export const NoListSelected: Story = { args: { status: LoadStatus.IDLE, todos: [] } };
export const Loading: Story = { args: { status: LoadStatus.LOADING, todos: [] } };
export const Errored: Story = { args: { status: LoadStatus.ERROR, todos: [] } };
