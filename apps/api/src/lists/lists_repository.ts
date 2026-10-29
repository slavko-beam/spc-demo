import type Database from 'better-sqlite3';

export type ListRecord = {
  id: number;
  name: string;
  openCount: number;
};

export class ListsRepository {
  constructor(private readonly db: Database.Database) {}

  findAll(): ListRecord[] {
    return this.db
      .prepare(
        `SELECT l.id, l.name, COUNT(t.id) FILTER (WHERE t.completed = 0) AS openCount
         FROM lists l LEFT JOIN todos t ON t.list_id = l.id
         GROUP BY l.id ORDER BY l.id`,
      )
      .all() as ListRecord[];
  }

  exists(id: number): boolean {
    return this.db.prepare('SELECT 1 FROM lists WHERE id = ?').get(id) !== undefined;
  }

  create(name: string): ListRecord {
    const { lastInsertRowid } = this.db.prepare('INSERT INTO lists (name) VALUES (?)').run(name);
    return { id: Number(lastInsertRowid), name, openCount: 0 };
  }
}
