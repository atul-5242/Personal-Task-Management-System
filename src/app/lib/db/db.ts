import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryString = "postgresql://neondb_owner:npg_LXhe0viR1GoP@ep-plain-snowflake-a8eiomaj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
// const queryString = process.env.DATABASE_URL as string;
export const connection = postgres(queryString);

export const db = drizzle(connection);