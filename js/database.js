import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

let db = null;

export async function initializeDatabase() {
    if (db) return db;

    db = await open({
        filename: '../db/data.db',
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
}