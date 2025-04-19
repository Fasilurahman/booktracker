import { migrate } from 'drizzle-orm/node-postgres/migrator'; 

import { db, pool } from "./connectDb";

async function main() {
    try {
        console.log('starting migration...');
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('migration completed...');
    } catch (error) {
        console.error('migration failed...', error);
    } finally {
        await pool.end();
        console.log('connection closed...');
    }
}

main();