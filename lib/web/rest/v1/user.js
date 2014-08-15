'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

var os = require('os');

router.get('/user', auth.requireAPIAuth(), function(req, res) {
  var user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  };

  restUtils.standardResponse(res, user, {type: 'user'});
});

router.get('/user/configuration', auth.requireAPIAuth(), function(req, res) {
  var services = req.app.get('service').config.get('pullConfiguration:environment:services');
  var environment_name = process.env.USVC_CONFIG_ENV || process.env.NODE_ENV || 'local';

  if (!services) {
    services = {
      mqtt: 'mqtt.sphere.ninja',
      id: 'id.sphere.ninja',
    };

    if (environment_name == 'local') {
      // provide LAN IP during development if nothing is defined
      var lan_ip = getExternalIPs()[0];
      for (var k in services) {
        services[k] = lan_ip;
      }
    }
  }

  var configuration = {
    environment: {
      name: environment_name,
      services: services,
    }
  };

  restUtils.standardResponse(res, configuration, {type: 'configuration'});
});

module.exports = function(parent) {
  parent.use(router);
};

// utility function to find 
function getExternalIPs() {
  var interfaces = os.networkInterfaces();
  var addresses = [];

  for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family == 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }

  return addresses;
}