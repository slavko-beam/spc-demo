import Database from 'better-sqlite3';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`;

const SEED: Record<string, string[]> = {
  Groceries: ['Oat milk', 'Sourdough', 'Coffee beans', 'Lemons'],
  Work: ['Write SPC README', 'Review store tests', 'Ship the navbar'],
  Home: ['Fix the tap', 'Water the plants'],
};

export const createDatabase = (filename: string): Database.Database => {
  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM lists').get() as { count: number };
  if (count > 0) return db;

  const insertList = db.prepare('INSERT INTO lists (name) VALUES (?)');
  const insertTodo = db.prepare('INSERT INTO todos (list_id, title) VALUES (?, ?)');
  db.transaction(() => {
    for (const [name, titles] of Object.entries(SEED)) {
      const { lastInsertRowid } = insertList.run(name);
      for (const title of titles) insertTodo.run(lastInsertRowid, title);
    }
  })();
  return db;
};
