const express = require('express');

const photos_router = express.Router();

photos_router.get('/', (req, res) => {
  console.info('photos / endpoint reached');
  res.send('photos endpoint reached');
});

module.exports = photos_router;
