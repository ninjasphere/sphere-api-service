'use strict';

var when = require('when');

exports.standardResponse = function(res, responsePromise, options) {
  options = options || {};

  when(responsePromise).done(
    function(result) {
      var type = options.type || (typeof result);
      
      if (Array.isArray(result)) {
        type = 'list';
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