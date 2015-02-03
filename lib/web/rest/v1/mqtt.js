'use strict';

var debug = require('debug')('frontend:mqtt');
var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

var os = require('os');

router.post('/mqtt', auth.requireAPIAuth(), function(req, res) {
  var userId = req.user.id;
  var topic = req.query.topic;
  var payload = req.body;

  if (typeof payload === 'object') {
  	payload = JSON.stringify(payload);
  }

  var routingKey = userId + '.' + topic.replace('/', '.');

  req.app.get('service').facet('amqp').then(function(amqp) {
  	amqp.publish('amq.topic', routingKey, new Buffer(payload));

  	debug('Publishing to routing key', routingKey, 'payload', payload);

  	restUtils.standardResponse(res, { "success": true }, {type: 'object'});
  });
});

module.exports = function(parent) {
  parent.use(router);
};
