const Database = require('better-sqlite3');
const faker = require('faker');

const generateFakeImgArray = () => {
  let arr = [];
  for (let i = 0; i < 1000; i++) {
    let fakeimgsrc = faker.image.image();
    arr.push({ idNum: i, imageSrc: fakeimgsrc, tagList: '' });
  }
  return arr;
};

const populate = () => {
  const db = new Database('photos.db', { fileMustExist: true });
  const fakeArr = generateFakeImgArray();

  const insertCMD = db.prepare(
    'INSERT OR REPLACE INTO phototags (idNum, imageSrc, tagList) VALUES (@idNum, @imageSrc, @tagList)'
  );

  const insertMany = db.transaction((arrFake) => {
    for (const elem of arrFake) insertCMD.run(elem);
  });
  insertMany.exclusive(fakeArr);

  db.close();
};

module.exports = populate;
