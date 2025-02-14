const configService = require('../services/configService');
const oldWidgetSentry = 'https://d03ae80a7cc44d628153135ad63d7a46@o96696.ingest.sentry.io/225972';
const newWidgetSentry = 'https://e1371a4b8ea1447091a795dd0ef80ad7@o412608.ingest.sentry.io/5290085';
import LoggerUtil from '../utils/logger';
import PayinController from './payinController';

const logger = LoggerUtil.get("homePagesController");

exports.showMainHomePage = (req, res, next) => {

	logger.info("Inside showMainHomePage function ....");

	// var isOld = req.sessionManager.getWidgetsType() === "OLD";
	// temporary fix
	var isOld = true;
	var loggedInUserID = req.sessionManager.getLoggedInUserId() || "NA";
	res.render('./home/default/homePageContainer.html', {
		widgetsPath: !isOld ? "widgets/newwidgets.min.js" : "website/lobby/js/widgets.min.js",
		isNewWidget: !isOld,
		sentryConfig: isOld ? oldWidgetSentry : newWidgetSentry,
		loggedInUserID: loggedInUserID
	});
}

exports.showInitiatePaymentPage = async function (req, res, next) {

	var queryParams = req.query;
	var isOld = req
	// getsType(req, "initiate_payment") === "OLD";
	req.redirectionFlow = true;
	if (queryParams.source == "JUSPAY") {
		logger.info("***Request from JUSPAY***...");
		await PayinController.paymentSuccessFromWeb(req, res);
		await showPaymentResponsePage(req, res, next);
		return;
	}
	logger.info("Inside showInitiatePaymentPage function ....");

	res.render('./home/default/payment.html', {
	});
}

exports.showInitiatePaymentPageGmz = async function (req, res, next) {

	var queryParams = req.query;
	var isOld = req
	// getsType(req, "initiate_payment") === "OLD";
	req.redirectionFlow = true;
	if (queryParams.source == "JUSPAY") {
		logger.info("***Request from JUSPAY***...");
		await PayinController.paymentSuccessFromWebGmz(req, res);
		await showPaymentResponsePage(req, res, next);
		return;
	}
	logger.info("Inside showInitiatePaymentPage function ....");

	res.render('./home/default/payment.html', {
	});
}

exports.showPaymentResponsePage = (req, res, next) => {

	logger.info("Inside showPaymentResponsePage function ...." + res);

	res.render('./home/default/payment.html', {
		success: res.paymentSuccessResponse.paymentStatus,
		isGatewayJusPay: (res.paymentSuccessResponse.gatewayJusPay === 'JUSPAY'),
		orderId: res.paymentSuccessResponse.orderId,
		timeData: res.paymentSuccessResponse.updatedAt,
	});
}
