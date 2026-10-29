import type { Preview } from '@storybook/react-vite';
import '../src/global.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
};

export default preview;
