import type { RouteObject } from 'react-router';

export type AppRoute = '/' | `/lists/${number}`;

export const HOME_ROUTE: AppRoute = '/';

export const listRoute = (listId: number): AppRoute => `/lists/${listId}`;

// Paths only: rendering is driven by RouterStore, not by React Router elements.
export const ROUTE_PATTERNS: RouteObject[] = [{ path: '/' }, { path: '/lists/:listId' }];
