import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { SubmitStatus } from '../../lib/submit_status.ts';
import { AddTodoFormView } from './add_todo_form.tsx';

describe('AddTodoFormView', () => {
  let onTitleChange: Mock<(title: string) => void>;
  let onSubmit: Mock<() => void>;

  beforeEach(() => {
    onTitleChange = vi.fn();
    onSubmit = vi.fn();
  });

  const renderForm = (overrides: Partial<React.ComponentProps<typeof AddTodoFormView>> = {}) =>
    render(
      <AddTodoFormView
        title="Lemons"
        status={SubmitStatus.IDLE}
        canSubmit
        onTitleChange={onTitleChange}
        onSubmit={onSubmit}
        {...overrides}
      />,
    );

  it('reports typing and submits on enter', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('New todo'), 's{Enter}');

    expect(onTitleChange).toHaveBeenCalledWith('Lemonss');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables the button when it cannot submit', () => {
    renderForm({ canSubmit: false });

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it.each([
    [SubmitStatus.SUBMITTING, 'Adding…'],
    [SubmitStatus.ERROR, 'Add'],
  ])('status %s labels the button "%s"', (status, label) => {
    renderForm({ status });

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('shows the error message on failure', () => {
    renderForm({ status: SubmitStatus.ERROR });

    expect(screen.getByText('Could not add todo')).toBeInTheDocument();
  });
});
