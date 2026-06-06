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

    return result.changes > 0 ? id : null;
}

async function deleteTask({ id }) {
    const db = await initializeDatabase();

    const query = `DELETE FROM tasks WHERE id = ?`;
    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function completeTask({ id }) {
    const db = await initializeDatabase();

    const query = `UPDATE tasks SET  completed = 1 WHERE id = ?`;
    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function markTaskAsIncomplete({ id }) {
    const db = await initializeDatabase();

    const query = `UPDATE tasks SET  completed = 0 WHERE id = ?`;
    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function getIncompleteTasksIds() {
    const db = await initializeDatabase();

    const query = `SELECT id FROM tasks WHERE completed = 0`;
    const rows = await db.all(query);

    return rows.map(row => row.id);
}

async function getTaskName({ id }) {
    const db = await initializeDatabase();

    const query = `SELECT name FROM tasks WHERE id = ?`;
    const row = await db.get(query, [id]);

    return row ? row.name : null;
}

module.exports = {
    insertNewTask,
    updateTaskName,
    deleteTask,
    completeTask,
    markTaskAsIncomplete,
    getIncompleteTasksIds,
    getTaskName
};