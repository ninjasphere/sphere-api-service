'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

router.get('/rooms', auth.requireUser({api: true}), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.listItems',
      req.user, 'rooms'
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.get('/rooms/:roomId', auth.requireUser({api: true}), function(req, res, roomId) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.getItem',
      req.user, 'rooms', roomId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

module.exports = router;
