'use strict';

var express = require('express');
var router = express.Router();

router.use(require('./activation'));
router.use(require('./user'));
router.use(require('./things'));
router.use(require('./rooms'));

module.exports = router;
