import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import type { ListsRepository } from './lists/lists_repository.ts';
import {
  AffectedSchema,
  CreateListBodySchema,
  CreateTodoBodySchema,
  ErrorSchema,
  ListIdParamsSchema,
  ListSchema,
  SetCompletedBodySchema,
  TodoIdsBodySchema,
  TodoSchema,
} from './schemas.ts';
import type { TodosRepository } from './todos/todos_repository.ts';

type Deps = {
  listsRepository: ListsRepository;
  todosRepository: TodosRepository;
};

const json = <T>(schema: T, description: string) => ({
  content: { 'application/json': { schema } },
  description,
});

const notFound = json(ErrorSchema, 'Not found');

const listLists = createRoute({
  operationId: 'listLists',
  method: 'get',
  path: '/lists',
  responses: { 200: json(ListSchema.array(), 'All lists') },
});

const createList = createRoute({
  operationId: 'createList',
  method: 'post',
  path: '/lists',
  request: { body: json(CreateListBodySchema, 'New list') },
  responses: { 201: json(ListSchema, 'Created list') },
});

const listTodos = createRoute({
  operationId: 'listTodos',
  method: 'get',
  path: '/lists/{listId}/todos',
  request: { params: ListIdParamsSchema },
  responses: { 200: json(TodoSchema.array(), 'Todos in the list'), 404: notFound },
});

const createTodo = createRoute({
  operationId: 'createTodo',
  method: 'post',
  path: '/lists/{listId}/todos',
  request: { params: ListIdParamsSchema, body: json(CreateTodoBodySchema, 'New todo') },
  responses: { 201: json(TodoSchema, 'Created todo'), 404: notFound },
});

const setTodosCompleted = createRoute({
  operationId: 'setTodosCompleted',
  method: 'post',
  path: '/todos/completed',
  request: { body: json(SetCompletedBodySchema, 'Todos to update') },
  responses: { 200: json(AffectedSchema, 'Number of todos updated') },
});

const deleteTodos = createRoute({
  operationId: 'deleteTodos',
  method: 'post',
  path: '/todos/delete',
  request: { body: json(TodoIdsBodySchema, 'Todos to delete') },
  responses: { 200: json(AffectedSchema, 'Number of todos deleted') },
});

export const createApp = ({ listsRepository, todosRepository }: Deps) => {
  const app = new OpenAPIHono();

  app.openapi(listLists, (c) => c.json(listsRepository.findAll(), 200));

  app.openapi(createList, (c) => c.json(listsRepository.create(c.req.valid('json').name), 201));

  app.openapi(listTodos, (c) => {
    const { listId } = c.req.valid('param');
    if (!listsRepository.exists(listId)) return c.json({ message: 'List not found' }, 404);
    return c.json(todosRepository.findByList(listId), 200);
  });

  app.openapi(createTodo, (c) => {
    const { listId } = c.req.valid('param');
    if (!listsRepository.exists(listId)) return c.json({ message: 'List not found' }, 404);
    return c.json(todosRepository.create(listId, c.req.valid('json').title), 201);
  });

  app.openapi(setTodosCompleted, (c) => {
    const { ids, completed } = c.req.valid('json');
    return c.json({ affected: todosRepository.setCompleted(ids, completed) }, 200);
  });

  app.openapi(deleteTodos, (c) => {
    const { ids } = c.req.valid('json');
    return c.json({ affected: todosRepository.delete(ids) }, 200);
  });

  return app;
};

export const OPENAPI_INFO = {
  openapi: '3.1.0',
  info: { title: 'SPC Todo API', version: '1.0.0' },
};
