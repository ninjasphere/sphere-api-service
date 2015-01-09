'use strict';

var debug = require('debug')('frontend:express');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var serveStatic = require('serve-static');

module.exports = function(setup) {
  var app = express();
  setup(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(require('cookie-parser')());
  app.use(serveStatic('public', {'index': ['index.html']}));

  var config = this.service.config;
  app.usvc_config = config;

  // setup sessions
  function hook_sessions(router) {
    var session_config = {
      secret: config.get('sessions:secret'),
      saveUninitialized: false,
      resave: false
    };
    if (config.get('sessions:store:type') == 'redis') {
      var RedisStore = require('connect-redis')(session);
      session_config.store = new RedisStore(config.get('sessions:store:options'));
    } else {
      throw new Error('Invalid session store specified');
    }
    router.use(session(session_config));
  }

  var corsOptions = this.service.config.get('cors:options');
  if (corsOptions && corsOptions.origin) {
    var cors = require('cors');
    debug('setup', 'Enabling CORS', corsOptions);
    app.use(cors(corsOptions));
  }

  // passport to authenticate
  require('./passport').setup(app, config.get('oauth'), hook_sessions);

  // our actual endpoints
  require('./rest/v1')(app, app);

  return app;
};
