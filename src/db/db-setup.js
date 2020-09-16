const faker = require('faker');
const Database = require('better-sqlite3');

const db = new Database('photos.db');

module.exports = () => {
  let cmdStr =
    'CREATE TABLE phototags (idNum INTEGER UNIQUE NOT NULL PRIMARY KEY, width INTEGER, height INTEGER, tagList TEXT)';
  let cmd = db.prepare(cmdStr);

  try {
    db.transaction(() => cmd.run());
  } catch (exception) {
    console.error(exception);
  }

  db.close();
};
