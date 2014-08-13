'use strict';

module.exports = {
  unknown_error: { code:500, type: 'internal_error', message:'An unknown internal error occurred.'},
  not_supported: { code:400, type: 'unsupported_endpoint', message:'This endpoint is not supported.'},

  signing_unavailable: { code:503, type: 'signing_unavailable', message:'Session signing is temporarily unavailable.'},

  unauthorized: {code: 401, type: 'unauthorized', message: 'This API call requires authentication'},

  send_error: function(res, error) {
    return res.json(error.code, { type: 'error', data: error });
  }
};
