'use strict';

var express = require('express');

var restUtils = require('../utils');

module.exports = function(parent, app) {
  var router = express.Router();

  require('./status')(router, app);
  require('./activation')(router, app);
  require('./user')(router, app);
  require('./auth')(router, app);
  require('./things')(router, app);
  require('./rooms')(router, app);
  require('./sites')(router, app);
  require('./mqtt')(router, app);

  // public configuration so knowing the api URL gives you the ID URL as well.
  router.get('/configuration', function(req, res) {
    var services = req.app.get('service').config.get('pullConfiguration:environment:services');
    var environment_name = process.env.USVC_CONFIG_ENV || process.env.NODE_ENV || 'local';

    if (!services) {
      services = {
        mqtt: 'mqtt.sphere.ninja',
        id: 'id.sphere.ninja',
      };

      if (environment_name == 'local') {
        // provide LAN IP during development if nothing is defined
        var lan_ip = restUtils.getExternalIPs()[0];
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

  parent.use('/rest/v1', router);
};

