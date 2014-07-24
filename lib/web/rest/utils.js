
exports.standardResponse = function(res, responsePromise) {
  responsePromise.done(
    function(result) {
      res.json({
        data: result
      });
    },
    function(err) {
      res.json(err.code, {
        error: err.message,
      });
    }
  );
};