'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

router.get('/things', auth.requireAPIAuth(), function(req, res) {
  var response = when.all([
    req.app.get('service').facet('modelStoreService'),
    req.app.get('service').facet('redis')
  ]).spread(function(modelStoreService, redis) {
    return modelStoreService.call(
      'modelstore.listItems',
      req.user, 'thing'
    ).timeout(25000).then(function(results){
        return getCachedLastState.call(
          redis,
          req.user,
          results
        );
      });
  });

  restUtils.standardResponse(res, response);
});

router.get('/things/:thingId', auth.requireAPIAuth(), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.getItem',
      req.user, 'thing', req.params.thingId
    ).timeout(25000);
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

// this function retrieves cached data from redis
function getCachedLastState(redis, user, results){
  return results.then(function(things){
    return when.map(things, function(thing){

      if (!thing.device || !thing.device.channels) {
        return thing;
      }

      // iterate over the channels and retrieve the last state
      return when.map(thing.device.channels, function(channel){
        return redis.get('state:'+user.id+':'+thing.device.id+':'+channel.id).then(function(value){
          channel.lastState = value;
          return channel;
        });
      });
    });

  });
}

module.exports = function(parent) {
  parent.use(router);
};