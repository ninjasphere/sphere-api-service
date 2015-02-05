var when = require('when');
var expect = require('chai').expect;

var restUtils = require('../lib/web/rest/utils');
var things = require('./fixtures/combine_things.json');
var devices = require('./fixtures/combine_devices.json');
var channels = require('./fixtures/combine_channels.json');


describe('utils', function () {

  it('should merge devices and channels into things', function(){

    return when.all([
      restUtils.combineThings.call(this, things, devices, channels)
    ]).spread(function(result){
//      console.log('result', result);
      expect(result[0].device).to.exist;
      expect(result[0].device.channels).to.exist;
    });

  });

});
