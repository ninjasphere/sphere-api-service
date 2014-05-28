var debug = require('debug')('frontend:express');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

module.exports = function(setup) {
  var app = express();
  setup(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(require('cookie-parser')());

  var config = this.service.config;

  // setup sessions
  var session_config = {
    secret: config.get('sessions:secret')
  };
  if (config.get('sessions:store:type') == 'redis') {
    var RedisStore = require('connect-redis')(session);
    session_config.store = new RedisStore(config.get('sessions:store:options'));
  } else {
    throw new Exception("Invalid session store specified");
  }
  app.use(session(session_config));

  var corsOptions = this.service.config.get('cors:options');
  if (corsOptions && corsOptions.origin) {
    var cors = require('cors');
    debug('setup', 'Enabling CORS', corsOptions);
    app.use(cors(corsOptions));
  }

  // passport to authenticate
  require('./passport').setup(app, config.get('oauth'));

  // our actual endpoints
  app.use('/rest/v1', require('./rest/v1'));

  return app;
};
