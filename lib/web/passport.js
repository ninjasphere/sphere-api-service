'use strict';

var debug = require('debug')('api:passport');
var passport = require('passport');
var express = require('express');
var NinjaStrategy = require('passport-ninja-blocks').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var errors = require('./rest/v1/errors');

exports.requireUser = function(options) {
  return function(req, res, next) {
    // debug(req.user, req.session);
    if (!req.user) {
      if (options.api) {
        // API users want a really obvious 403, not a redirect
        var error = {code: 403, type: 'authentication_required', message: 'This API call requires authentication'};
        return res.send(403, { type: 'error', error: error });
      } else {
        return res.redirect('/auth/ninja');
      }
    } else {
      next();
    }
  };
};

exports.requireAPIAuth = function(options) {
  if (typeof options === 'string') {
    options = { scope: options };
  } else {
    options = options || {};
    options.scope = options.scope || 'api:*';
  }

  return function(req, res, next) {
    var authFunc = passport.authenticate('bearer', { session: false, failWithError: true });
    var reqUserFunc = exports.requireUser({ api: true});

    debug('requireAPIAuth', options);
    req._auth_options = options;

    debug('calling authfunc');
    authFunc(req, res, function(err) {
      if (err) {
        if (err.status === 401) {
          return errors.send_error(res, errors.unauthorized);
        } else if (err.type && err.code && err.message) {
          return errors.send_error(res, {type:err.type, code:err.code, message:err.message});
        }

        // otherwise handle as normal
        debug('arguments', arguments);
        return next(err);
      }
      debug('calling reqUserFunc', arguments);
      try {
        reqUserFunc(req, res, next);
      } catch (err) {
        debug('reqUserFunc', err);
        next(err);
      }
    });
  };
};

exports.setup = function(app, oauth_config, hook_sessions) {
  app.use(passport.initialize());

  passport.serializeUser(function (user, done) {
    debug('serialize', user);
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    debug('deserialize', obj);
    done(null, obj);
  });

  app.set('_passport_session_hook', function(router) {
    hook_sessions(router);
    // re-initialize passport. this .initialize() actually hooks the session object (WTF)
    router.use(passport.initialize());
    router.use(passport.session());
  });

  debug('oauth_config', oauth_config);

  // FIXME: make this only work on the auth endpoints, and only use sessions there
  passport.use(new NinjaStrategy(oauth_config,
    function (accessToken, refreshToken, profile, done) {
      var user = {id:profile.id, name: profile.displayName, email: profile.username, accessToken: accessToken};
      debug('user', user);

      done(null, user);
    }
  ));
  // errors.send_error(res, errors.unauthorized);
  // Bearer tokens are passed off to the authentication RPC
  passport.use(new BearerStrategy(
    { passReqToCallback: true },
    function(req, token, done) {
      debug('bearer', 'validating token');
      var validationResult = app.get('service').facet('activationService').then(function(activationService) {
        return activationService.call(
          'authentication.validateAccessToken',
          token,
          req._auth_options.scope
        ).timeout(5000);
      });

      validationResult.done(function(result) {
        done(null, result.user);
      }, function(err) {
        debug('bearerStrategy', 'error:', err);
        done(err);
      });
    }
  ));

  // set up authentication endpoints
  var router = express.Router();

  var authenticationOptions = {
    scope: '*',
    failureRedirect: '/'
  };

  app.get('_passport_session_hook')(router); // hook in sessions

  router.get('/ninja', passport.authenticate('ninja-blocks', authenticationOptions));

  router.get('/ninja/callback', passport.authenticate('ninja-blocks', authenticationOptions), function (req, res) {
    res.redirect('/');
  });

  router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
  });

  // to isolate session support to a router, it must be bound to a path (not just 'use'd)
  app.use('/auth', router);

};
