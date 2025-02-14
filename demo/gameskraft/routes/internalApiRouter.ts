var bodyParser = require("body-parser");
import AuthController from "../controllers/authController";
import ServerController from "../controllers/serverController";
import UserController from '../controllers/userController';
import PayinControllerV2 from "../controllers/v2/payinController";

var router;

/*
 * NOTE: All these APIs are supposed to be called from other internal services, NOT VIA INTERNET.
 * These requests should not be used to record client IP or any other device params.
 */

const internalApiRouter = function(express) {
	router = express.Router();

	// Session Check
	__registerGetRoute("/user/session", true, UserController.getSession);

	// User document upload. Store details in session.
	__registerPostRoute("/user/session/uploads", true, UserController.updateUploadsInSession);

	// DO NOT USE THIS BELOW API - DEPRECATED - ONLY FOR OLD GS
	__registerGetRoute("/user/location/:userId", false, UserController.getLocationInternalAPI);

	__registerGetRoute("/:vendor/user/payment/:userId/refund", false, PayinControllerV2.getUserRefundDetails);
	__registerPostRoute("/:vendor/user/payment/:userId/refund", false, PayinControllerV2.CreateUserRefund);

	// Shut down api for handling socket disconnection
	__registerPostRoute("/shutdown", false, ServerController.ServerShutDown);

	return router;
};

function __registerPostRoute(route, isProtected, mainHandler) {
	var handlers = [];

	// Check for valid logged in user
	if (isProtected) {
		handlers.push(AuthController.checkLoggedInUserForApi);
	}


	handlers.push(bodyParser.text());
	handlers.push(bodyParser.urlencoded({ extended: true }));
	handlers.push(bodyParser.json());
	handlers.push(mainHandler);

	router.post(route, handlers);
}


function __registerGetRoute(route, isProtected, mainHandler) {
	var handlers = [];

	// Check for valid logged in user
	if (isProtected) {
		handlers.push(AuthController.checkLoggedInUserForApi);
	}

	handlers.push(mainHandler);

	router.get(route, handlers);
}

export {internalApiRouter};
