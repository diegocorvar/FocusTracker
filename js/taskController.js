const { initializeDatabase } = require('./database.js');

async function insertNewTask({ name }) {
    const db = await initializeDatabase();

    const query = `INSERT INTO tasks (name) VALUES(?)`;
    const result = await db.run(query, [name]);

    return result.lastID; 
}

async function updateTaskName({ name, id }) {
    const db = await initializeDatabase();

    const query = `UPDATE tasks SET  name = ? WHERE id = ?`;
    const result = await db.run(query, [name, id]);

    return result.changes > 0;
}

module.exports = { insertNewTask, updateTaskName };