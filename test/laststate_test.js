var usvc = require('usvc');
var when = require('when');
var expect = require('chai').expect;

var lastState = require('../lib/web/rest/laststate');
var things = require('./fixtures/things.json');

describe('last state', function () {

  var service = usvc.microService({
    // backing stores
    redis: usvc.facets.db.redis()
  });

  before(function () {
    service.run();
    return service.facet('redis').then(function (redis) {
      return redis.client.set("state:123:7511a8ecc5:media", JSON.stringify(
        {
          "params": [{
            "media": {
              "id": "x-sonos-spotify:spotify%3atrack%3a3FUS56gKr9mVBmzvlnodlh?sid=12\u0026flags=32\u0026sn=1",
              "type": "music-track",
              "title": "Killing In The Name",
              "duration": 314000,
              "artists": [{"name": "Rage Against The Machine"}],
              "album": {"name": "Rage Against The Machine"}
            }, "position": 239000
          }], "jsonrpc": "2.0", "time": 1422501653158
        }
      ));
    });
  });

  it('should add laststate', function () {

    var user = {id: 123};

    return when.all([
      service.facet('redis'),
      getThings.call()
    ]).spread(function (redis, results) {
      return lastState.getCachedLastStateForThings.call(this, redis, user, results).then(function(payload){
        expect(payload[2].device.channels[1].lastState).to.exist;
        expect(payload[2].device.channels[1].lastState.timestamp).to.exist;
        expect(payload[2].device.channels[1].lastState.payload.position).to.equal(239000);
      })
    });
  });

});

function getThings() {
  var deferred = when.defer();

  deferred.resolve(things);

  return deferred.promise;
}
