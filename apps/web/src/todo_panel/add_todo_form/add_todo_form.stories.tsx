import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SubmitStatus } from '../../lib/submit_status.ts';
import { AddTodoFormView } from './add_todo_form.tsx';

const meta = {
  component: AddTodoFormView,
  args: {
    title: '',
    status: SubmitStatus.IDLE,
    canSubmit: false,
    onTitleChange: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof AddTodoFormView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { title: 'Lemons', canSubmit: true } };
export const Submitting: Story = { args: { title: 'Lemons', status: SubmitStatus.SUBMITTING } };
export const Errored: Story = {
  args: { title: 'Lemons', status: SubmitStatus.ERROR, canSubmit: true },
};
