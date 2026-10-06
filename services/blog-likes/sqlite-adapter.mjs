// Local tests and preview only; the deployed Worker uses its D1 binding.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

export function createLocalDatabase(filename = ':memory:') {
  const sqlite = new DatabaseSync(filename);
  sqlite.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  let queue = Promise.resolve();
  return {
    sqlite,
    prepare(sql) {
      return {
        sql,
        values: [],
        bind(...values) { return { sql, values }; },
      };
    },
    batch(statements) {
      const operation = queue.then(() => {
        sqlite.exec('BEGIN IMMEDIATE');
        try {
          const result = statements.map(statement => ({
            success: true,
            results: sqlite.prepare(statement.sql).all(...statement.values),
          }));
          sqlite.exec('COMMIT');
          return result;
        } catch (error) {
          sqlite.exec('ROLLBACK');
          throw error;
        }
      });
      queue = operation.catch(() => {});
      return operation;
    },
    close() { sqlite.close(); },
  };
}
