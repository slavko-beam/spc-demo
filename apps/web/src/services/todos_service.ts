import type { ApiClient, Todo } from '@spc/api-client';
import { unwrap } from './api_error.ts';

export class TodosService {
  constructor(private readonly client: ApiClient) {}

  async getByList(listId: number): Promise<Todo[]> {
    return unwrap(await this.client.GET('/lists/{listId}/todos', { params: { path: { listId } } }));
  }

  async create(listId: number, title: string): Promise<Todo> {
    return unwrap(
      await this.client.POST('/lists/{listId}/todos', {
        params: { path: { listId } },
        body: { title },
      }),
    );
  }

  async setCompleted(ids: number[], completed: boolean): Promise<number> {
    return unwrap(await this.client.POST('/todos/completed', { body: { ids, completed } }))
      .affected;
  }

  async delete(ids: number[]): Promise<number> {
    return unwrap(await this.client.POST('/todos/delete', { body: { ids } })).affected;
  }
}
