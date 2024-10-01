import sqlite from 'sqlite3'

// The database is created and the foreign keys are enabled.
export const db = new sqlite.Database('database.sqlite', (err) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

export function runQuery(query) {
    db.run(query, function(err) {
        if (err) {
            console.error(`Failed query: \n${query}\n${err.message}\n`);
        }
    });
}