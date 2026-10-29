import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { configure } from 'mobx';
import { afterEach } from 'vitest';

configure({ enforceActions: 'always' });

afterEach(() => {
  cleanup();
});
