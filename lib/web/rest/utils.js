'use strict';

var when = require('when');

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
      res.json(err.code, {
        type: 'error',
        data: err,
      });
    }
  );
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
}