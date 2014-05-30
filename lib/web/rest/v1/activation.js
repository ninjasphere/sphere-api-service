'use strict';

var debug = require('debug')('frontend:activation');
var when = require('when');
var express = require('express');
var router = express.Router();
var auth = require('../../passport');
var errors = require('./errors');

router.get('/node/:nodeId/activate', function(req, res) {
	debug('activate', req.params.nodeId);
	req.app.get('service').facet('activationService').then(function(activationService) {
		return activationService.call(
			'activation.nodeAwaitingActivation',
			req.params.nodeId.toString(),
			{ local_ip: req.query.local_ip }
		).timeout(25000);
	}).done(function(result) {
		res.json(result);
	}, function(err) {
		res.send(err.code, err);
	});
});

router.post('/node', auth.requireUser({api: true}), function(req, res) {
	debug('pair', req.body.nodeId);
	req.app.get('service').facet('activationService').then(function(activationService) {
		return activationService.call(
			'activation.userClaimingNode',
			req.user, req.body.nodeId.toString()
		).timeout(25000);
	}).done(function(result) {
		res.json(result);
	}, function(err) {
		res.send(err.code, err);
	});
});

router.get('/node', auth.requireUser({api: true}), function(req, res) {
	debug('list');
	req.app.get('service').facet('activationService').then(function(activationService) {
		return activationService.call(
			'activation.listUserActivatedNodes',
			req.user
		).timeout(25000);
	}).done(function(result) {
		res.json({ nodes: result });
	}, function(err) {
		res.send(err.code, err);
	});
});

router.delete('/node/:nodeId', auth.requireUser({api: true}), function(req, res) {
	debug('delete', req.params.nodeId);
	req.app.get('service').facet('activationService').then(function(activationService) {
		return activationService.call(
			'activation.userDeactivateNode',
			req.user, req.params.nodeId.toString()
		).timeout(25000);
	}).done(function(result) {
		res.json(result);
	}, function(err) {
		res.send(err.code, err);
	});
});


module.exports = router;
