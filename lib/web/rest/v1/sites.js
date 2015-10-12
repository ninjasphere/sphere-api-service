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

router.put('/sites/:siteId', auth.requireAPIAuth(), function(req, res) {
  return restUtils.methodNotAllowedResponse(res); // temporarily disabled

  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.updateItem',
      req.user, 'site', req.params.siteId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.post('/sites', auth.requireAPIAuth(), function(req, res) {
  return restUtils.methodNotAllowedResponse(res); // temporarily disabled

  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.createItem',
      req.user, 'site', req.params.siteId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.delete('/sites/:siteId', auth.requireAPIAuth(), function(req, res) {
  return restUtils.methodNotAllowedResponse(res); // temporarily disabled

  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.deleteItem',
      req.user, 'site', req.params.siteId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.get('/sites/:siteId/tags/:tagId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.getTag',
      req.user, req.params.siteId, req.params.tagId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.post('/sites/:siteId/tags/:tagId', auth.requireAPIAuth(), function(req, res) {
  if (req.get('Content-Type') != 'application/json') {
    return restUtils.unsupportedMediaType(res); // temporarily disabled
  }

  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.postTag',
      req.user, req.params.siteId, req.params.tagId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.put('/sites/:siteId/tags/:tagId', auth.requireAPIAuth(), function(req, res) {
  if (req.get('Content-Type') != 'application/json') {
    return restUtils.unsupportedMediaType(res); // temporarily disabled
  }

  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.putTag',
      req.user, req.params.siteId, req.params.tagId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

module.exports = function(parent) {
  parent.use(router);
};
