import type Database from 'better-sqlite3';

export type TodoRecord = {
  id: number;
  listId: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type TodoRow = Omit<TodoRecord, 'completed'> & { completed: 0 | 1 };

const SELECT_TODO = `SELECT id, list_id AS listId, title, completed, created_at AS createdAt FROM todos`;

const toRecord = (row: TodoRow): TodoRecord => ({ ...row, completed: row.completed === 1 });

const placeholders = (ids: number[]) => ids.map(() => '?').join(', ');

export class TodosRepository {
  constructor(private readonly db: Database.Database) {}

  findByList(listId: number): TodoRecord[] {
    const rows = this.db
      .prepare(`${SELECT_TODO} WHERE list_id = ? ORDER BY id`)
      .all(listId) as TodoRow[];
    return rows.map(toRecord);
  }

  findById(id: number): TodoRecord | undefined {
    const row = this.db.prepare(`${SELECT_TODO} WHERE id = ?`).get(id) as TodoRow | undefined;
    return row && toRecord(row);
  }

  create(listId: number, title: string): TodoRecord {
    const { lastInsertRowid } = this.db
      .prepare('INSERT INTO todos (list_id, title) VALUES (?, ?)')
      .run(listId, title);
    return this.findById(Number(lastInsertRowid))!;
  }

  setCompleted(ids: number[], completed: boolean): number {
    if (ids.length === 0) return 0;
    return this.db
      .prepare(`UPDATE todos SET completed = ? WHERE id IN (${placeholders(ids)})`)
      .run(completed ? 1 : 0, ...ids).changes;
  }

  delete(ids: number[]): number {
    if (ids.length === 0) return 0;
    return this.db.prepare(`DELETE FROM todos WHERE id IN (${placeholders(ids)})`).run(...ids)
      .changes;
  }
}
