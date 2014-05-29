'use strict';

module.exports = {
  unknown_error: { result:0, id:500, error:'An unknown internal error occurred.'},
  not_supported: { result:0, id:400, error:'This endpoint is not supported.'},

  send_error: function(res, error) {
    return res.json(error.id, error);
  }
};
