import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LoadStatus } from '../lib/load_status.ts';
import { listFixture } from '../test/fixtures.ts';
import { ListSidebarView } from './list_sidebar.tsx';

const meta = {
  component: ListSidebarView,
  args: {
    lists: [
      listFixture({ id: 1, name: 'Groceries', openCount: 4 }),
      listFixture({ id: 2, name: 'Work', openCount: 3 }),
      listFixture({ id: 3, name: 'Home', openCount: 0 }),
    ],
    status: LoadStatus.LOADED,
    selectedListId: 1,
    onSelect: fn(),
  },
} satisfies Meta<typeof ListSidebarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {};
export const NothingSelected: Story = { args: { selectedListId: undefined } };
export const Loading: Story = { args: { lists: [], status: LoadStatus.LOADING } };
export const Errored: Story = { args: { lists: [], status: LoadStatus.ERROR } };
