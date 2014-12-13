'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

router.get('/rooms', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.listItems',
      req.user, 'room'
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.get('/rooms/:roomId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.getItem',
      req.user, 'room', req.params.roomId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.put('/rooms/:roomId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.updateItem',
      req.user, 'room', req.params.roomId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.post('/rooms', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.createItem',
      req.user, 'room', req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.delete('/rooms/:roomId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.deleteItem',
      req.user, 'room', req.params.roomId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

module.exports = function(parent) {
  parent.use(router);
};
