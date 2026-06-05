const { initializeDatabase } = require('./database.js');

async function saveTask({ name }) {
    const db = await initializeDatabase();

    const query = `INSERT INTO tasks (name) VALUES(?)`;
    const result = await db.run(query, [name]);

    return result.lastID; 
}

module.exports = {saveTask};