const express = require('express');
const path = require('path');
const router = express.Router();

router.all('*', (req, res, next) => {
  console.log("caught in catchall");
  res.sendFile(path.resolve('./public/dist/public/index.html'));
});

module.exports = router;
