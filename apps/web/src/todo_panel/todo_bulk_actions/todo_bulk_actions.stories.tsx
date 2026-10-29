import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TodoBulkActionsView } from './todo_bulk_actions.tsx';

const meta = {
  component: TodoBulkActionsView,
  args: {
    selectedCount: 2,
    onCompleteSelected: fn(),
    onDeleteSelected: fn(),
    onClearSelection: fn(),
  },
} satisfies Meta<typeof TodoBulkActionsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};
export const NothingSelected: Story = { args: { selectedCount: 0 } };
