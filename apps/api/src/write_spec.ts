import { writeFileSync } from 'node:fs';
import { createApp, OPENAPI_INFO } from './create_app.ts';
import { createDatabase } from './db/create_database.ts';
import { ListsRepository } from './lists/lists_repository.ts';
import { TodosRepository } from './todos/todos_repository.ts';

const db = createDatabase(':memory:');
const app = createApp({
  listsRepository: new ListsRepository(db),
  todosRepository: new TodosRepository(db),
});

const spec = app.getOpenAPI31Document(OPENAPI_INFO);
writeFileSync(new URL('../openapi.json', import.meta.url), `${JSON.stringify(spec, null, 2)}\n`);
console.log('Wrote apps/api/openapi.json');
