process.title = 'sphere-api-service';

if (process.env.BUGSNAG_KEY) {
  var bugsnag = require("bugsnag");
  bugsnag.register(process.env.BUGSNAG_KEY, { releaseStage: process.env.USVC_CONFIG_ENV || 'development' });
}

var usvc = require('usvc');

var service = usvc.microService({
	// database connections
	redis: usvc.facets.db.redis(),

	// bus connections
	amqp: usvc.facets.msg.amqp(),

	// rpc interface
	activationService: usvc.facets.rpc.jsonClient(),
	modelStoreService: usvc.facets.rpc.jsonClient(),

	// external rest api
	frontendRest: usvc.facets.web.express(require('./lib/web'), {depends: ['redis', 'amqp']})
}).run();
