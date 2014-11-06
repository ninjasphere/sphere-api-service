'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

router.get('/sites', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.listItems',
      req.user, 'site'
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.get('/sites/:siteId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.getItem',
      req.user, 'site', req.params.siteId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

module.exports = function(parent) {
  parent.use(router);
};
