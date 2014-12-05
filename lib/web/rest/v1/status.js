var express = require('express');
var router = express.Router();

var restUtils = require('../utils');

var os = require('os');


router.get('/status', auth.requireAPIAuth(), function(req, res) {
  restUtils.standardResponse(res, {msg: 'ok'}, {type: 'status'});
});
