import PublicApiController from "../controllers/publicApiController";
import AppController from "../controllers/appController";
import faqController from "../controllers/faqController";

let router;

const practicePublicApiRouter = function(express) {
	router = express.Router();

	__registerGetRoute('/v1/profile/faq', faqController.getPracticeFaq);
    __registerGetRoute('/v1/rng/config', AppController.getRNGConfig);
    __registerGetRoute('/v1/app/videos', PublicApiController.getPracticeAppVideos);

	return router;
};

function __registerGetRoute(route, mainHandler) {
	var handlers = [];
	handlers.push(mainHandler);
	router.get(route, handlers);
}

export {practicePublicApiRouter};
