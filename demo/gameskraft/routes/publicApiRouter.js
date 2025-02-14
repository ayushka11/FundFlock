import PublicApiController from "../controllers/publicApiController";

var bodyParser = require('body-parser');
import AppController from "../controllers/appController";
import faqController from "../controllers/faqController";

let router;

/*
 * NOTE: All these APIs are supposed to be cached in Varnish.
 * So no POST calls are allowed. For the same reason
 * no cookie based APIs are allowed here.
 */

const publicApiRouter = function(express) {
	router = express.Router();

	///////////////////////// Games Feed APIs ///////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////

	///////////////////////// FAQ APIs ///////////////////////////////////////

	__registerGetRoute('/v1/profile/faq', faqController.getFaq);

    __registerGetRoute('/v1/rng/config', AppController.getRNGConfig);

    __registerGetRoute('/v1/app/videos', PublicApiController.getAppVideos);

	__registerPostRoute('/v1/pocket52/sendAppDownloadLink', PublicApiController.sendPocket52AppDownloadLink);

    __registerPostRoute('/v1/pocket52/rummy/sendAppDownloadLink', PublicApiController.sendPocket52RummyAppDownloadLink);

    __registerPostRoute('/v1/gamezy/sendAppDownloadLink', PublicApiController.sendGamezyAppDownloadLink);

	/////////////////////////////////////////////////////////////////////////////////

	return router;
};

function __registerGetRoute(route, mainHandler) {
	var handlers = [];

	handlers.push(mainHandler);

	router.get(route, handlers);
}

function __registerPostRoute(route, mainHandler) {
    var handlers = [];

    handlers.push(bodyParser.text());
    handlers.push(bodyParser.urlencoded({ extended: true }));
    handlers.push(bodyParser.json());
    handlers.push(mainHandler);

    router.post(route, handlers);
}

export {publicApiRouter};
