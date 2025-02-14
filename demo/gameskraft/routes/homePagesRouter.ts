import AuthController from '../controllers/authController';
import PayinController from '../controllers/payinController';
const bodyParser = require('body-parser');
const homePagesController = require('../controllers/homePagesController');

const homePagesRouter = function(express) {
	const router = express.Router();

	// Valid Routes
	router.get('/', AuthController.checkLoggedInUserForPage, homePagesController.showMainHomePage);


	router.get("/payment", AuthController.checkLoggedInUserForPage, homePagesController.showInitiatePaymentPage);
	router.get("/gmz/payment", AuthController.checkLoggedInUserForPage, homePagesController.showInitiatePaymentPageGmz);

	router.post("/payment", 
//			bodyParser.text(),
			bodyParser.urlencoded({ extended: true }),
			bodyParser.json(),
			PayinController.paymentSuccessFromWeb,
			homePagesController.showPaymentResponsePage);

	router.post("/gmz/payment", 
	//			bodyParser.text(),
				bodyParser.urlencoded({ extended: true }),
				bodyParser.json(),
				PayinController.paymentSuccessFromWebGmz,
				homePagesController.showPaymentResponsePage);

	return router;
}

export {homePagesRouter};
