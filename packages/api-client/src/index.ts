import createClient from 'openapi-fetch';
import type { components, paths } from './schema.gen.ts';

export type ApiClient = ReturnType<typeof createApiClient>;

export type List = components['schemas']['List'];
export type Todo = components['schemas']['Todo'];

export const createApiClient = (baseUrl: string) => createClient<paths>({ baseUrl });
