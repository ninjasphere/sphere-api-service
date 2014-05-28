process.title = 'sphere-api-service';

var usvc = require('usvc');

var service = usvc.microService({
	// database connections
	redis: usvc.facets.db.redis(),

	// rpc interface
	activationService: usvc.facets.rpc.jsonClient(),

	// external rest api
	frontendRest: usvc.facets.web.express(require('./lib/web'), {depends: ['redis']}),
}).run();
