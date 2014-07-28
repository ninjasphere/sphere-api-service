'use strict';

module.exports = {
  unknown_error: { code:500, type: 'internal_error', message:'An unknown internal error occurred.'},
  not_supported: { code:400, type: 'unsupported_endpoint', message:'This endpoint is not supported.'},

  send_error: function(res, error) {
    return res.json(error.code, { type: 'error', error: error });
  }
};
