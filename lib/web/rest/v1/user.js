'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

router.get('/user', auth.requireAPIAuth(), function(req, res) {
  var user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  };

  restUtils.standardResponse(res, user, {type: 'user'});
});

module.exports = function(parent) {
  parent.use(router);
};
