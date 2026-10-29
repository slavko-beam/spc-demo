import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TodoTableRowView } from './todo_table_row.tsx';

const meta = {
  component: TodoTableRowView,
  decorators: [
    (Story) => (
      <table>
        <tbody>{Story()}</tbody>
      </table>
    ),
  ],
  args: {
    id: 1,
    title: 'Oat milk',
    completed: false,
    isSelected: false,
    onToggleSelected: fn(),
    onToggleCompleted: fn(),
  },
} satisfies Meta<typeof TodoTableRowView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
export const Completed: Story = { args: { completed: true } };
export const Selected: Story = { args: { isSelected: true } };
export const SelectedAndCompleted: Story = { args: { isSelected: true, completed: true } };
