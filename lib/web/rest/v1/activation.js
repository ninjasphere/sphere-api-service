'use strict';

var debug = require('debug')('frontend:activation');
var when = require('when');
var express = require('express');
var router = express.Router();
var auth = require('../../passport');
var errors = require('./errors');

var restUtils = require('../utils');

router.get('/node/:nodeId/activate', function(req, res) {
  debug('activate', req.params.nodeId);
  var result = req.app.get('service').facet('activationService').then(function(activationService) {
    return activationService.call(
      'activation.nodeAwaitingActivation',
      req.params.nodeId.toString(),
      {
        local_ip: req.query.local_ip,
        hardware_type: req.query.board_type || req.query.hardware_type || 'unknown',
      }
    ).timeout(25000);
  });

  restUtils.standardResponse(res, result, {type: 'node_claim'});
});

router.post('/node', auth.requireAPIAuth(), function(req, res) {
  debug('pair', req.body.nodeId);
  var result = req.app.get('service').facet('activationService').then(function(activationService) {
    return activationService.call(
      'activation.userClaimingNode',
      req.user, (req.body.nodeId || '').toString()
    ).timeout(25000);
  });

  restUtils.standardResponse(res, result);
});

router.get('/node', auth.requireAPIAuth(), function(req, res) {
  debug('list');
  var result = req.app.get('service').facet('activationService').then(function(activationService) {
    return activationService.call(
      'activation.listUserActivatedNodes',
      req.user
    ).timeout(25000);
  });

  restUtils.standardResponse(res, result, {type: 'node'});
});

router.delete('/node/:nodeId', auth.requireAPIAuth(), function(req, res) {
  debug('delete', req.params.nodeId);
  var result = req.app.get('service').facet('activationService').then(function(activationService) {
    return activationService.call(
      'activation.userDeactivateNode',
      req.user, req.params.nodeId.toString()
    ).timeout(25000);
  });

  restUtils.standardResponse(res, result);
});


router.get('/site', auth.requireAPIAuth(), function(req, res) {
  debug('list');
  var result = req.app.get('service').facet('activationService').then(function(activationService) {
    return activationService.call(
      'activation.listSites',
      req.user
    ).timeout(25000);
  });

  restUtils.standardResponse(res, result, {type: 'site'});
});

router.get('/site/:siteId', auth.requireAPIAuth(), function(req, res) {
  debug('get', req.params.siteId);
  var result = req.app.get('service').facet('activationService').then(function(activationService) {
    return activationService.call(
      'activation.getSite',
      req.user, req.params.siteId.toString()
    ).timeout(25000);
  });

  restUtils.standardResponse(res, result, {type: 'site'});
});

module.exports = function(parent) {
  parent.use(router);
};

