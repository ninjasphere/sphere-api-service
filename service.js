process.title = 'sphere-api-service';

if (process.env.BUGSNAG_KEY) {
  var bugsnag = require("bugsnag");
  bugsnag.register(process.env.BUGSNAG_KEY, { releaseStage: process.env.USVC_CONFIG_ENV || 'development' });
}

var usvc = require('usvc');

var service = usvc.microService({
	// database connections
	redis: usvc.facets.db.redis(),

	// rpc interface
	activationService: usvc.facets.rpc.jsonClient(),

	// external rest api
	frontendRest: usvc.facets.web.express(require('./lib/web'), {depends: ['redis']}),
}).run();
