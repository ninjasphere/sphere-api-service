'use strict';

var express = require('express');
var when = require('when');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');
var lastState = require('../laststate');

router.get('/things', auth.requireAPIAuth(), function(req, res) {
  var response = when.all([
    req.app.get('service').facet('modelStoreService'),
    req.app.get('service').facet('redis')
  ]).spread(function (modelStoreService, redis) {
    return when.all([
      modelStoreService.call(
        'modelstore.listItems',
        req.user, 'thing'
      ),
      modelStoreService.call(
        'modelstore.listItems',
        req.user, 'device'
      ),
      modelStoreService.call(
        'modelstore.listItems',
        req.user, 'channel'
      )
    ]).spread(restUtils.combineThings.call(this, things, devices, channels)).timeout(25000).then(function (results) {
        return lastState.getCachedLastStateForThings.call(
          this,
          redis,
          req.user,
          results
        );
      });
  });

  restUtils.standardResponse(res, response);
});

router.get('/things/:thingId', auth.requireAPIAuth(), function(req, res) {
  var response = when.all([
    req.app.get('service').facet('modelStoreService'),
    req.app.get('service').facet('redis')
  ]).spread(function(modelStoreService, redis) {
    return modelStoreService.call(
      'modelstore.getItem',
      req.user, 'thing', req.params.thingId
    ).timeout(25000).then(function(result){
        return lastState.getCachedLastStateForThing.call(
          this,
          redis,
          req.user,
          result
        );
      });
  });

  restUtils.standardResponse(res, response);
});

router.put('/things/:thingId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.updateItem',
      req.user, 'thing', req.params.thingId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.post('/things', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.createItem',
      req.user, 'thing', req.params.thingId, req.body
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.delete('/things/:thingId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.deleteItem',
      req.user, 'thing', req.params.thingId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

module.exports = function(parent) {
  parent.use(router);
};