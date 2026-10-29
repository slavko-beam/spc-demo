import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { createApp, OPENAPI_INFO } from './create_app.ts';
import { createDatabase } from './db/create_database.ts';
import { ListsRepository } from './lists/lists_repository.ts';
import { TodosRepository } from './todos/todos_repository.ts';

const PORT = Number(process.env.PORT ?? 3001);
const LATENCY_MS = Number(process.env.API_LATENCY_MS ?? 300);

const db = createDatabase(process.env.DATABASE_FILE ?? 'todos.db');
const app = createApp({
  listsRepository: new ListsRepository(db),
  todosRepository: new TodosRepository(db),
});

app.doc31('/openapi.json', OPENAPI_INFO);

// Artificial latency so loading states and optimistic updates are visible in the demo.
const server = new Hono();
server.use(async (_c, next) => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  await next();
});
server.route('/', app);

serve({ fetch: server.fetch, port: PORT }, ({ port }) => {
  console.log(`API listening on http://localhost:${port}`);
});
