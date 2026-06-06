const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function initializeDatabase() {
    if (db) return db;

    db = await open({
        filename: path.join(__dirname, '../db/data.db'),
        driver: sqlite3.Database
    });

    console.log('connection established');

    await createTables();

    return db;
}

async function createTables() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            completionDate TEXT NULL,
            focusTimeInSec INTEGER DEFAULT 0
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS currentFocusSesion (
            id INTEGER PRIMARY KEY,
            hours INTEGER DEFAULT 0 NOT NULL,
            minutes INTEGER DEFAULT 0 NOT NULL,
            seconds INTEGER DEFAULT 0 NOT NULL
        ); 
    `);

    await db.run(`
        INSERT INTO currentFocusSesion (id)
        VALUES (1) 
        ON CONFLICT(id) DO NOTHING;
    `)
}

module.exports = {initializeDatabase};