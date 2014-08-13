'use strict';

var debug = require('debug')('sphere:rest:auth');
var express = require('express');
var auth = require('../../passport');
var errors = require('./errors');
var restUtils = require('../utils');

module.exports = function(parent, app) {
  var router = express.Router();
  app.get('_passport_session_hook')(router); // hook in sessions

  router.get('/auth/session_token', auth.requireUser({api: true}), function(req, res) {
    var sessionToken = req.app.get('service').facet('activationService').then(function(activationService) {
      return activationService.call(
        'authentication.generateSignedSessionToken',
        req.user // user already authenticated
      ).timeout(5000);
    });

    var signed_data = sessionToken.then(function(token) {
      return {
        token: token,
      };
    });

    restUtils.standardResponse(res, signed_data, {type: 'session_token'});
  });

  parent.use(router);
};
