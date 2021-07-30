const express = require('express');
const router = express();

router.get('/', (req, res) => {
  res.send('posts is start ');
});
router.post('/', (req, res, next) => {


});
module.exports = router; 