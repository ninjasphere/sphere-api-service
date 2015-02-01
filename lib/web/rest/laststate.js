var when = require('when');

// this function retrieves cached data from redis
exports.getCachedLastState = function (redis, user, results) {
  return when.map(results, function (thing) {

    if (!thing.device || !thing.device.channels) {
      return thing;
    }

    // iterate over the channels and retrieve the last state
    return when.map(thing.device.channels, function (channel) {
      return redis.client.get('state:' + user.id + ':' + thing.device.id + ':' + channel.id).then(function (value) {
        var payload = JSON.parse(value);
        if (!payload || !payload.params[0])return channel;
        channel.lastState = {timestamp: payload.time, payload: payload.params[0]};
        return channel;
      });
    }).then(function(channels){
      thing.channels = channels;
      return thing
    });
  });
};
