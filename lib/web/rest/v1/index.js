'use strict';

var express = require('express');

module.exports = function(parent, app) {
  var router = express.Router();

  require('./activation')(router, app);
  require('./user')(router, app);
  require('./auth')(router, app);
  require('./things')(router, app);
  require('./rooms')(router, app);

  parent.use('/rest/v1', router);
};
