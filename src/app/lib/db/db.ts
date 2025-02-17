import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

<<<<<<< HEAD

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
=======

const queryString = process.env.DATABASE_URL as string;
export const connection = postgres(queryString);

export const db = drizzle(connection);
>>>>>>> 7483ced2ea854e7d2f9b1c41602429322a29f84d
