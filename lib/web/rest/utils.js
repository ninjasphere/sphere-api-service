'use strict';

var when = require('when');
var debug = require('debug')('api:rest_utils');

exports.standardResponse = function(res, responsePromise, options) {
  options = options || {};

  when(responsePromise).done(
    function(result) {
      var type = options.type || (typeof result);

      if (Array.isArray(result)) {
        type = 'list';
        // least awful way of removing deleted documents from search the results
        result = result.filter(function(e){return e != undefined});
      }

      res.json({
        type: type,
        data: result
      });
    },
    function(err) {
      console.log('error', err.stack);
      res.json(err.code, {
        type: 'error',
        data: err
      });
    }
  );
};

exports.methodNotAllowedResponse = function(res) {
  res.status(405).end();
};

exports.unsupportedMediaType = function(res) {
  res.status(415).end();
};

exports.getExternalIPs = function() {
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
};

var combineThings = exports.combineThings = function(things, devices, channels) {

//  debug('combineThings', 'things', things);

  return when.map(things, combineThing.bind(this, devices, channels));

};

var combineThing = exports.combineThing = function(devices, channels, thing) {

    if (!thing) return thing;

    var resd = devices.filter(function(device){
      return device.id === thing.deviceId
    });
//    debug('combineThings', 'devices', devices);
//    debug('combineThings', 'resd', resd);

    if (Array.isArray(resd)){
      thing.device = resd[0];

      var resc = channels.filter(function(channel){
        return channel.deviceId === thing.deviceId
      });
//      debug('combineThings', 'resc', resc);

      if (Array.isArray(resc) && thing.device){
        thing.device.channels = resc;
      }
    }

    return thing;
};
