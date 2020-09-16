const Database = require('better-sqlite3');
const fs = require('fs');
const dbPopulate = require('./db-populate');

const dbExistsCheckAndFix = () => {
  const file = 'photos.db';
  try {
    if (fs.existsSync(file)) {
      console.log('removing db');
      fs.unlinkSync(file);
    }
  } catch (err) {
    console.error(err);
  }
};

const createDB = () => {
  const db = new Database('photos.db');

  let cmdStr =
    'CREATE TABLE phototags (idNum INTEGER UNIQUE NOT NULL PRIMARY KEY, imageSrc TEXT, tagList TEXT)';
  let cmd = db.prepare(cmdStr);

  try {
    const setupTrans = db.transaction(() => cmd.run());
    setupTrans.exclusive();
  } catch (exception) {
    console.error(exception);
  }

  db.close();
};

const setupDB = async () => {
  dbExistsCheckAndFix();
  createDB();
  dbPopulate();
};

module.exports = setupDB;
