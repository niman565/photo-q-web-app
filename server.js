const express = require('express');
const photos_router = require('./src/routes/photos');
const dbSetup = require('./src/db/db-setup');
const cleanUp = require('./src/clean-up/clean-up');

dbSetup();

const app = express();

const myLogger = (req, res, next) => {
  console.log('Request made');
  next();
};

app.use(myLogger);

app.get('/', (req, res) => {
  res.send('Request recieved');
});

app.use('/photos', photos_router, (req, res) => {
  res.status(401).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

let server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const path_delete = 'photos.db';
cleanUp(server, path_delete);
