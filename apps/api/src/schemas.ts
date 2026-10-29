import { z } from '@hono/zod-openapi';

export const ListSchema = z
  .object({
    id: z.int(),
    name: z.string(),
    openCount: z.int(),
  })
  .openapi('List');

export const TodoSchema = z
  .object({
    id: z.int(),
    listId: z.int(),
    title: z.string(),
    completed: z.boolean(),
    createdAt: z.string(),
  })
  .openapi('Todo');

export const ErrorSchema = z.object({ message: z.string() }).openapi('Error');

export const ListIdParamsSchema = z.object({
  listId: z.coerce
    .number()
    .int()
    .openapi({ param: { name: 'listId', in: 'path' } }),
});

export const CreateListBodySchema = z.object({ name: z.string().trim().min(1) });

export const CreateTodoBodySchema = z.object({ title: z.string().trim().min(1) });

export const TodoIdsBodySchema = z.object({ ids: z.array(z.int()).min(1) });

export const SetCompletedBodySchema = TodoIdsBodySchema.extend({ completed: z.boolean() });

export const AffectedSchema = z.object({ affected: z.int() }).openapi('Affected');
