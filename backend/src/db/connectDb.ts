import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres'; 
import { config } from 'dotenv'


config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool)

export async function connectDB() {
    try {
        await pool.connect(); 
        console.log('✅ Connected to PostgreSQL Database');
    } catch (error) {
        console.error('❌ Failed to connect to DB:', error);
        process.exit(1);
    }
}