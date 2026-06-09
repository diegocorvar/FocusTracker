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

    const query = `
        UPDATE tasks
        SET completed = 1, completionDate = date('now', 'localtime')
        WHERE id = ?
    `;
    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function markTaskAsIncomplete({ id }) {
    const db = await initializeDatabase();

    const query = `
        UPDATE tasks
        SET  completed = 0, completionDate = NULL
        WHERE id = ?
    `;
    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function getIncompleteTasks() {
    const db = await initializeDatabase();

    const query = `SELECT * FROM tasks WHERE completed = 0`;
    const rows = await db.all(query);

    return rows ? rows : null;
}

async function getTaskName({ id }) {
    const db = await initializeDatabase();

    const query = `SELECT name FROM tasks WHERE id = ?`;
    const row = await db.get(query, [id]);

    return row ? row.name : null;
}

async function increaseFocusTime({ id, focusTimeInSec}) {
    const db = await initializeDatabase();

    const query = `
        UPDATE tasks
        SET focusTimeInSec = focusTimeInSec + ?
        WHERE id = ?
    `;
    const result = await db.run(query, [focusTimeInSec, id]);

    return result.changes > 0;
}

async function updateCurrentFocusTime({ hours, minutes, seconds }) {
    const db = await initializeDatabase();

    const query = `
        UPDATE currentFocusSesion
        SET hours = ?, minutes = ?, seconds = ?
        WHERE id = 1
    `;
    const result = await db.run(query, [hours, minutes, seconds]);

    return result.changes > 0;
}

async function getCurrentFocusTime() {
    const db = await initializeDatabase();

    const query = `SELECT * FROM currentFocusSesion WHERE id = 1`;
    const row = await db.get(query);

    return row ? row : null;
}

async function setTaskFinishDate({ id }) {
    const db = await initializeDatabase();

    const query = `
        UPDATE tasks
        SET completionDate = date('now', 'localtime')
        WHERE id = ?
    `;

    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function removeTaskFinishDate({ id }) {
    const db = await initializeDatabase();

    const query = `
        UPDATE tasks
        SET completionDate = NULL
        WHERE id = ?
    `;

    const result = await db.run(query, [id]);

    return result.changes > 0;
}

async function searchTask({ id }) {
    const db = await initializeDatabase();

    const query = `SELECT * FROM tasks WHERE id = ?`;
    const row = await db.get(query, [id]);

    return row ? row : null;
}

async function searchCompletedTasksByDay({ day }) {
    const db = await initializeDatabase();

    const query = `SELECT * FROM tasks WHERE completionDate = ?`;
    const rows = await db.all(query, [day]);

    return rows ? rows : null;
}

async function getTotalFocusTimePerDay({ day }) {
    const db = await initializeDatabase();

    const query = `
        SELECT completionDate AS date, IFNULL(SUM(focusTimeInSec), 0) AS totalSec
        FROM tasks
        WHERE completionDate = ?
    `;
    const row = await db.get(query, [day]);

    return row ? row : null;
}

module.exports = {
    insertNewTask,
    updateTaskName,
    deleteTask,
    completeTask,
    markTaskAsIncomplete,
    getIncompleteTasks,
    getTaskName,
    increaseFocusTime,
    updateCurrentFocusTime,
    getCurrentFocusTime,
    setTaskFinishDate,
    removeTaskFinishDate,
    searchTask,
    searchCompletedTasksByDay,
    getTotalFocusTimePerDay
};