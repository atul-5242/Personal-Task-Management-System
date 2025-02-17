import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';


const queryString = process.env.DATABASE_URL;

let connection: postgres.Sql;
let db: PostgresJsDatabase;

try {
  connection = postgres(queryString as string);
  db = drizzle(connection);
} catch (error) {
  console.error('Failed to connect to database:', error);
  throw error;
}
export { connection, db };

