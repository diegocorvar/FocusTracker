import { initializeDatabase } from "./database.js";

export async function saveTask(taskName) {
    const db = await initializeDatabase();

    const query = `INSTER INTO tasks (name) VALUES (?)`;
    const result = await db.run(query, [taskName]);

    return result.lastID;
}