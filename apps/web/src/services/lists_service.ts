import type { ApiClient, List } from '@spc/api-client';
import { unwrap } from './api_error.ts';

export class ListsService {
  constructor(private readonly client: ApiClient) {}

  async getAll(): Promise<List[]> {
    return unwrap(await this.client.GET('/lists'));
  }
}
