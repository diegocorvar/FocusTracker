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

async function incompleteTask({ id }) {
    const db = await initializeDatabase();

    const query = `UPDATE tasks SET  completed = 0 WHERE id = ?`;
    const result = await db.run(query, [id]);

    return result.changes > 0;
}

module.exports = {
    insertNewTask,
    updateTaskName,
    deleteTask,
    completeTask,
    incompleteTask
};