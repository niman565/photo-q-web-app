const express = require('express');

const app = express();

const myLogger = (req, res, next) => {
  console.log('Request made');
  next();
};

app.use(myLogger);

app.get('/', (req, res) => {
  res.send('Request recieved');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
