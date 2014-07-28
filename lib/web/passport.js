'use strict';

var passport = require('passport');
var NinjaStrategy = require('passport-ninja-blocks').Strategy;

exports.requireUser = function(options) {
  return function(req, res, next) {
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

exports.setup = function(app, oauth_config){
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  passport.use(new NinjaStrategy(oauth_config,
    function (accessToken, refreshToken, profile, done) {

      // add the access token for saving
      profile.accessToken = accessToken;

      var user = {id:profile.id, name: profile.displayName, email: profile.username, accessToken: accessToken};

      done(null, user);

    }
  ));

  app.get('/auth/ninja', passport.authenticate('ninja-blocks'));

  app.get('/auth/ninja/callback', passport.authenticate('ninja-blocks', {
    failureRedirect: '/'
  }), function (req, res) {
    res.redirect('/');
  });

  app.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
  });

};
