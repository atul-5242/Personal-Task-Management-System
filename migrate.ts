import { db, connection } from "./src/app/lib/db/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";

(async () => {
    await migrate(db, {
        migrationsFolder: "./drizzle",
    });
    await connection.end();
})();   
