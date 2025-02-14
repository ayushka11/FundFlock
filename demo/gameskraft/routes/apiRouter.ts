import PayinController from '../controllers/payinController';
import KycController from "../controllers/kycController";
import AuthController from "../controllers/authController";
import UserController from '../controllers/userController';
import ZodiacController from "../controllers/zodiacController";
import RoyaltyController from "../controllers/RoyaltyController";
import promosController from "../controllers/promosController";
import SupernovaController from "../controllers/supernovaController";
import PlanetController from "../controllers/planetController";
import UserFeedbackController from "../controllers/userFeedbackController";
import HomeController from "../controllers/homeController";
import LobbyController from "../controllers/lobbyController";
import PublicApiController from "../controllers/publicApiController";
import TableController from '../controllers/tableController';
import AppController from "../controllers/appController";
import ReferralController from '../controllers/referralController';
import ReferralControllerV2 from '../controllers/v2/referralController'
import InvoiceController from '../controllers/invoiceController';
import PayinControllerV2 from '../controllers/v2/payinController';
import promosControllerV2 from '../controllers/v2/promosController';
//V2 Controllers
import ZodiacControllerV2 from '../controllers/v2/zodiacController';

//V2 Controllers
import PayoutControllerV2 from '../controllers/v2/payoutController';
import CommunicationController from '../controllers/communicationController';
import PolicyController from '../controllers/policyController';
import LeaderboardController from '../controllers/leaderboardController';
import { AddCashDownTimeMiddleware } from '../middlewares/addcash-downtime-middleware';
import { WithdrawalDownTimeMiddleware } from '../middlewares/withdrawal-downtime-middleware';
import AdminController from '../controllers/adminController';
import RegosController from '../controllers/regosController';
import AffiliateController from "../controllers/affiliateController";
import PslController from "../controllers/pslController";

const faqController = require("../controllers/faqController");
const requestHelper = require("../helpers/requestHelper");
const bodyParser = require('body-parser');
let router;

const apiRouter = function (express) {
    router = express.Router();

    ////////////////////////// User Authentication APIs /////////////////////
    __registerPostRoute('/auth/logout', true, AuthController.logoutUser);

    // __registerPostRoute('/auth/validateTrueProfile', false, authController.validateTrueProfile);
    // __registerPostRoute('/auth/loginTrueProfile', false, authController.loginTrueProfileBasedOnVersion);
    __registerPostRoute('/auth/generateOtp', false, AuthController.generateOtp);
    __registerPostRoute('/auth/otpLogin', false, AuthController.otpLogin);
    __registerPostRoute('/auth/trueCallerLogin', false, AuthController.trueCallerLogin);
    __registerPostRoute('/auth/login', false, AuthController.loginWithPassword);
    __registerPostRoute('/auth/refresh', true, AuthController.refreshToken);
    __registerPostRoute('/auth/generateOtpForgotPassword', false, AuthController.generateOtpForgotPassword);
    __registerPostRoute('/auth/verifyOtpForgotPassword', false, AuthController.verifyOtpForgotPassword);
    __registerGetRoute('/user/user_logged_in_state', true, AuthController.userLoggedinState);
    __registerGetRoute('/user/session', true, AuthController.userSession);
    __registerPostRoute('/auth/setPassword', true, AuthController.setUserPassword);
    __registerPostRoute('/v2/auth/trueCallerLogin', false, AuthController.trueCallerLoginV2);

    /////////////////////////////////////////////////////////////////////////
    ////////////////////////// KYC APIs ///////////////////////////////
    __registerGetRoute('/v1/user/kyc/config', true, KycController.getUserKycConfig);
    __registerGetRoute('/v1/user/kyc/bank/ifsc', true, KycController.getUserKycIfscDetails);
    __registerPostRoute('/v1/user/kyc/verify/bank', true, KycController.verifyKycBankDocuments);
    __registerPostRoute('/v1/user/kyc/verify/upi', true, KycController.verifyKycUpiDocuments);
    __registerPostRoute('/v1/user/kyc/verify/document', true, KycController.verifyKycDocuments);
    __registerGetRoute('/v1/user/kyc/extract', true, KycController.extractKycDocumentDetails);
    __registerGetRoute('/v1/user/kyc/details', true, KycController.getUserKycDetails);
    __registerPostRoute('/v1/user/kyc/webhook', false, KycController.processKycWebhook);
    __registerPostRoute('/v1/user/kyc/:vendor/webhook', false, KycController.processKycWebhookForVendor);
    __registerGetRoute('/kyc/digilocker/config', true, KycController.getDigilockerStateConfig);
    __registerPostRoute('/kyc/digilocker/initiate', true, KycController.initiateDigilockerKyc);

    /////////////////////////////////////////////////////////////////////////
    ////////////////////////// User Details APIs ///////////////////////////////
    __registerGetRoute('/user/summary', true, UserController.getUserSummary);
    __registerGetRoute('/v2/user/summary', true, UserController.getUserSummaryV2);
    __registerGetRoute('/user/avatar', true, UserController.getUserAvatars);
    __registerPostRoute('/user/checkStatus', true, UserController.checkStatus);
    __registerGetRoute('/user/checkPermission', true, UserController.checkPermission);
    __registerGetRoute('/user/personal', true, UserController.getUserPersonal);
    __registerPostRoute('/user/personal', true, UserController.updateUserPersonal, true);
    __registerPostRoute('/user/personal/checkusername', true, UserController.checkUsername);
    __registerPostRoute('/user/verifyEmail', true, UserController.verifyEmail);

    /////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Payment APIs /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Exotel APIs ///////////////////////////////
    // All would be no-auth APIs. But


    ////////////////////
    /// ADD CASH API's
    __registerGetRoute('/v1/user/payment/methods', true, PayinController.getUserPaymentMethods);
    // __registerGetRoute('/v1/user/payment/order/status', true, PayinController.getUserOrderStatus);
    // __registerPostRoute('/v1/user/payment/initiate', true, [AddCashDownTimeMiddleware, PayinController.initiatePayment]);
    // __registerGetRoute('/v1/user/promotions', true, promosController.getUserPromos);
    // __registerPostRoute('/v1/payment/tenet/webhook', false, PayinController.processTenetPaymentWebhookResponse);
    // __registerPostRoute('/v1/payment/tenet/gmz/webhook', false, PayinController.processTenetPaymentWebhookResponseGmz);
    // __registerPostRoute('/v1/payment/updateOrderStatus', true, PayinController.paymentSuccessFromSDK);
    __registerPostRoute('/v1/payment/delete/paymentMethod', true, PayinController.deletePaymentMethod);

    // __registerGetRoute('/v1/user/payment/refund/details', true, PayinController.getUserRefundDetails);
    // __registerPostRoute('/v1/user/payment/refund', true, PayinController.initiateUserRefund);
    // __registerGetRoute('/v1/user/payment/history', true, PayinController.getUserAddCashHistory);
    // __registerGetRoute('/v1/user/payment/refund/history', true, PayinController.getUserAddCashRefundHistory);
    __registerGetRoute('/v1/user/payment/offers', true, promosController.getUserOffers);
    __registerPostRoute('/v2/user/payment/card/details', true, PayinControllerV2.getCardDetails);
    __registerGetRoute('/v2/user/promotions', true, promosControllerV2.getUserPromos);
    __registerPostRoute('/v2/user/payment/initiate', true, [AddCashDownTimeMiddleware, PayinControllerV2.initiatePayment]);
    __registerGetRoute('/v2/user/payment/order/status', true, PayinControllerV2.getUserOrderStatus);
    __registerGetRoute('/v2/user/payment/order/details', true, PayinControllerV2.getUserOrderDetails);
    __registerPostRoute('/v2/payment/tenet/:vendor/webhook', false, PayinControllerV2.processTenetPaymentWebhookResponseV2);
    __registerGetRoute('/v2/user/payment/history', true, PayinControllerV2.getUserAddCashHistory);
    __registerGetRoute('/v2/user/payment/refund/history', true, PayinControllerV2.getUserAddCashRefundHistory);
    __registerPostRoute('/v2/payment/updateOrderStatus', true, PayinControllerV2.paymentSuccessFromSDKV2);

    ////////////////////
    /// APP CONFIG API's
    __registerGetRoute('/app/config', true, AppController.getAppConfig);
    __registerPostRoute('/user/packages', true, UserController.storeUserPackages);

    ////////////////////
    /// HOME API's
    __registerGetRoute('/v1/home/widgets', true, HomeController.getHomeScreenWidgets);
    __registerGetRoute('/v2/home/widgets', true, HomeController.getHomeScreenWidgetsV2);
    __registerGetRoute('/v3/home/widgets', true, HomeController.getHomeScreenWidgetsV3);
    __registerGetRoute('/v4/home/widgets', true, HomeController.getHomeScreenWidgetsV4);
    __registerGetRoute('/v1/recommended/rooms', true, HomeController.getRecommendedRooms);
    __registerGetRoute('/v1/recommended/groups', true, HomeController.getRecommendedGroups);
    __registerGetRoute('/v1/online/users/count', true, HomeController.getOnlineUsersCount);

    ////////////////////
    /// LOBBY API's
    __registerGetRoute('/v1/banners/lobby', false, LobbyController.getLobbyBanners);
    __registerGetRoute('/v1/lobby/config', true, LobbyController.getLobbyConfig);
    __registerGetRoute('/v1/banners/onboarding', false, PublicApiController.getOnboardingBanners);

    ////////////////////
    /// USER FEEDBACK API's
    __registerPostRoute('/v1/user/feedback', true, UserFeedbackController.pushUserFeedback);

    ////////////////////
    // FAQ APIs
    __registerGetRoute('/v1/faq', true, faqController.getFaq);

    ///////////////////
    // APP Constants APIs
    __registerGetRoute('/v1/kyc/constants', true, KycController.getKycConstants);

    ////////////////////
    /// Withdrawal API's
    // __registerGetRoute('/v1/user/withdrawal/details', true, PayoutController.getPayoutDetails);
    // __registerPostRoute('/v1/user/withdrawal/validate', true, PayoutController.validatePayoutRequest);
    // __registerPostRoute('/v1/user/withdrawal/create', true, [WithdrawalDownTimeMiddleware, PayoutController.createPayoutOrder]);
    // __registerGetRoute('/v1/user/withdrawal/transactions', true, PayoutController.getPayoutTransactions);
    // __registerGetRoute('/v1/user/withdrawal/transaction/:transferId', true, PayoutController.getPayoutTransaction);
    // __registerPostRoute('/v1/withdrawal/tenet/webhook', false, PayoutController.processTenetPayoutWebhookResponse);
    // __registerPostRoute('/v1/withdrawal/tenet/webhook/gmz', false, PayoutController.processTenetPayoutWebhookResponseGmz);

    /// Withdrawal API's
    __registerGetRoute('/v2/user/withdrawal/details', true, PayoutControllerV2.getPayoutDetailsV2);
    __registerGetRoute('/v2/user/withdrawal/packs', true, PayoutControllerV2.getPayoutPacksV2);
    __registerPostRoute('/v2/user/withdrawal/validate', true, PayoutControllerV2.validatePayoutRequestV2);
    __registerPostRoute('/v2/user/withdrawal/create', true, [WithdrawalDownTimeMiddleware, PayoutControllerV2.createPayoutOrderV2]);
    __registerGetRoute('/v2/user/withdrawal/transactions', true, PayoutControllerV2.getPayoutTransactionsV2);
    __registerGetRoute('/v2/user/withdrawal/transaction/:transferId', true, PayoutControllerV2.getPayoutTransactionV2);
    __registerGetRoute('/v2/user/withdrawal/status/:transferId', true, PayoutControllerV2.getPayoutStatusV2);
    __registerPostRoute('/v2/withdrawal/tenet/:vendor/webhook', false, PayoutControllerV2.processTenetPayoutWebhookResponseV2);


    ////////////////////
    // Royalty APIs
    __registerPostRoute('/v1/user/royalty/coins/redeem', true, RoyaltyController.redeemCoins);
    __registerPostRoute('/v2/user/royalty/coins/redeem', true, RoyaltyController.redeemCoinsV2);
    __registerGetRoute('/v1/home/royalty/info', true, RoyaltyController.getRoyaltyHomeInfo);
    __registerGetRoute('/v1/user/royalty/info', true, RoyaltyController.getUserRoyaltyInfo);
    __registerGetRoute('/v1/royalty/faq', true, RoyaltyController.getRoyaltyFAQs);
    __registerGetRoute('/v1/royalty/user/payments/moreInfo', true, RoyaltyController.getRoyaltyAddCashUserDetails);

    ////////////////////
    // Referral APIs
    // Referral V2
    __registerGetRoute('/v2/user/referees/list', true, ReferralControllerV2.getUserReferees);
    __registerGetRoute('/v2/user/referral/details', true, ReferralControllerV2.getReferralDetails);
    __registerGetRoute('/v2/user/referral/stats', true, ReferralControllerV2.getUserReferralStats);

    // Referral V1
    // __registerGetRoute('/v1/user/referees/list', true, ReferralController.getUserReferees);
    // __registerGetRoute('/v1/user/referral/details', true, ReferralController.getReferralDetails);
    // __registerGetRoute('/v1/user/referral/stats', true, ReferralController.getUserReferralStats);
    __registerGetRoute('/v1/user/referral/:referCode/validate', false, ReferralController.validateReferCode);
    __registerGetRoute('/v1/user/referral/share', true, ReferralController.getUserReferralSharePayload);

    ////////////////////
    // Wallet APIs
    // __registerGetRoute('/v1/wallet/cash/tickets', true, SupernovaController.getCashTickets);
    // __registerGetRoute('/v1/wallet/tournament/tickets', true, SupernovaController.getTournamentTickets);
    // __registerGetRoute('/v1/wallet/transactions/cash/ticket/:ticketId', true, SupernovaController.getCashTicketTransactions);
    // __registerGetRoute('/v1/wallet/reward/cashbacks', true, SupernovaController.getCashbacks);
    __registerGetRoute('/v1/wallet/balance', true, SupernovaController.getBalance);
    __registerGetRoute('/v2/wallet/balance', true, SupernovaController.getBalanceV2);
    __registerGetRoute('/v1/wallet/details', true, SupernovaController.getWalletDetails);
    __registerGetRoute('/v1/wallet/transactions/all', true, SupernovaController.getWalletTransactions);
    __registerGetRoute('/v1/wallet/transactions/gameplay', true, SupernovaController.getWalletGameplayTransactions);
    __registerGetRoute('/v1/wallet/transactions/tds', true, SupernovaController.getWalletTdsTransactions);
    __registerGetRoute('/v1/wallet/transactions/dcs', true, SupernovaController.getWalletDcsTransactions);
    __registerGetRoute('/v1/wallet/transactions/tdc', true, SupernovaController.getWalletTdcTransactions);
    __registerGetRoute('/v1/wallet/transactions/leaderboard', true, SupernovaController.getWalletLeaderboardTransactions);
    __registerGetRoute('/v1/wallet/transaction', true, SupernovaController.getWalletTransaction);
    __registerGetRoute('/v1/wallet/transaction/dcs', true, SupernovaController.getDcsWalletTransaction);
    __registerGetRoute('/v1/wallet/transaction/tdc', true, SupernovaController.getTdcWalletTransaction);
    __registerGetRoute('/v1/wallet/transaction/tds', true, SupernovaController.getTdsWalletTransaction);
    __registerGetRoute('/v1/wallet/transaction/leaderboard', true, SupernovaController.getWalletLeaderboardTransaction);
    __registerGetRoute('/v1/wallet/tournamentDetailsRegisterThroughDepositReward', true, SupernovaController.getUserTournamentRegisteredByDepositReward);
    __registerGetRoute('/v2/wallet/tournamentDetailsRegisterThroughDepositReward', true, SupernovaController.getUserTournamentRegisteredByDepositRewardV2);
    __registerGetRoute('/v1/wallet/lockedDcs/pack/details', true, SupernovaController.getUserLockedDcsPackDetails);

    ///////////////////
    // Location APIs
    __registerGetRoute('/v1/user/location', true, PlanetController.getLocationDetails);
    __registerGetRoute('/v1/location/restricted/states', true, PlanetController.getRestrictedStates)

    ///////////////////
    //// REWARDS API
    __registerPostRoute('/v1/rewards/tenet/:vendor/webhook', false, RegosController.allocateRewardWebhook);


    ////////////////////
    /// User Peripheral (Gameplay | Non Gameplay) APIs
    __registerGetRoute('/v1/user/cash/:tableId/hand/history/active', true, ZodiacController.getUserCashTableActiveHandHistory);
    __registerGetRoute('/v1/user/practice/:tableId/hand/history/active', true, ZodiacController.getUserPracticeTableActiveHandHistory);
    __registerGetRoute('/v1/user/tournament/:tournamentId/hand/history/active', true, ZodiacController.getUserTournamentActiveHandHistory);
    __registerGetRoute('/v1/user/cash/hand/history', true, ZodiacController.getUserCashTableHandHistory);
    __registerGetRoute('/v1/user/practice/hand/history', true, ZodiacController.getUserPracticeTableHandHistory);
    __registerGetRoute('/v1/user/tournament/hand/history', true, ZodiacController.getUserTournamentHandHistory);
    __registerGetRoute('/v1/user/cash/:tableId/hand/:handId/details', true, ZodiacController.getUserCashTableHandDetails);
    __registerGetRoute('/v1/user/practice/:tableId/hand/:handId/details', true, ZodiacController.getUserPracticeTableHandDetails);
    __registerGetRoute('/v1/user/tournament/:tournamentId/hand/:handId/details', true, ZodiacController.getUserTournamentHandDetails);
    __registerGetRoute('/v1/user/hand/:handId/details', true, ZodiacController.getUserHandDetails);
    __registerGetRoute('/v1/user/tournament/history', true, ZodiacController.getUserTournamentHistory);
    __registerGetRoute('/v1/user/stats', true, ZodiacController.getUserStats);
    __registerGetRoute('/v1/user/:userId/gameplay/stats', true, ZodiacController.getUserGameplayStats);


    __registerGetRoute('/v2/user/cash/:tableId/hand/history/active', true, ZodiacControllerV2.getUserHandsListByTableId);
    __registerGetRoute('/v2/user/cash/:tableId/hand/:handId/details', true, ZodiacControllerV2.getUserHandDetailsByHandId);
    __registerGetRoute('/v2/user/cash/:tableId/hand/:handId/summary', true, ZodiacControllerV2.getUserHandSummaryByHandId);
    __registerGetRoute('/v2/user/practice/:tableId/hand/history/active', true, ZodiacControllerV2.getUserPracticeHandsListByTableId);
    __registerGetRoute('/v2/user/practice/:tableId/hand/:handId/details', true, ZodiacControllerV2.getUserPracticeHandDetailsByHandId);
    __registerGetRoute('/v2/user/practice/:tableId/hand/:handId/summary', true, ZodiacControllerV2.getUserPracticeHandSummaryByHandId);
    __registerGetRoute('/v2/user/tournament/:tournamentId/hand/history/active', true, ZodiacControllerV2.getUserTournamentHandsListByTournamentId);
    __registerGetRoute('/v2/user/tournament/:tournamentId/hand/:handId/details', true, ZodiacControllerV2.getUserTournamentHandDetailsByHandId);
    __registerGetRoute('/v2/user/tournament/:tournamentId/hand/:handId/summary', true, ZodiacControllerV2.getUserTournamentHandSummaryByHandId);
    __registerGetRoute('/v2/user/:tableId/hand/history/active', true, ZodiacControllerV2.getUserHandsListByTableId);
    __registerGetRoute('/v2/user/:tableId/hand/:handId/details', true, ZodiacControllerV2.getUserHandDetailsByHandId);
    __registerGetRoute('/v2/user/:tableId/hand/:handId/summary', true, ZodiacControllerV2.getUserHandSummaryByHandId);

    ////////////////////
    // Policy Api routes
    __registerGetRoute('/v1/user/policy', true, PolicyController.getUserPolicy);
    __registerPostRoute('/v1/user/policy/acknowledge', true, PolicyController.createUserPolicyAcknowledgement);

    ////////////////////
    // User Notes APIs
    __registerPostRoute('/v1/user/gameplay/note', true, ZodiacController.createUserNote);
    __registerGetRoute('/v1/user/gameplay/notes', true, ZodiacController.getUserNotes);
    __registerPostRoute('/v2/user/gameplay/note', true, ZodiacController.createUserNoteV2);
    __registerPostRoute('/v2/user/gameplay/fetch/notes', true, ZodiacController.getUserNotesV2);
    __registerPostRoute('/v1/user/gameplay/details', true, ZodiacController.getUserDetails);
    __registerPutRoute('/v1/user/gameplay/note/color', true, ZodiacController.updateUserNoteColor);
    __registerGetRoute('/v1/user/gameplay/note/colors', true, ZodiacController.getUserNoteColors);

    ///////////////////
    /// User Gameplay APIs
    __registerPutRoute('/v1/user/gameplay/settings/bet', true, ZodiacController.updateUserBetSettings);
    __registerPutRoute('/v1/user/gameplay/settings/game', true, ZodiacController.updateUserGameSettings);
    __registerPutRoute('/v1/user/gameplay/settings/sound', true, ZodiacController.updateUserSoundSettings);
    __registerPutRoute('/v1/user/gameplay/settings/autoTopUp', true, ZodiacController.updateUserAutoTopUpSettings);
    __registerGetRoute('/v1/user/gameplay/settings', true, ZodiacController.getUserGameplaySettings);
    __registerGetRoute('/v2/user/gameplay/settings', true, ZodiacController.getUserGameplaySettingsV2);

    ////////////////////
    /// LOBBY API's
    // __registerGetRoute('/v1/lobby/banners', true, LobbyController.getLobbyBanners);
    __registerGetRoute('/v1/lobby/rooms', true, LobbyController.getRooms);
    __registerGetRoute('/v1/lobby/groups', true, LobbyController.getGroups);
    __registerGetRoute('/v1/lobby/room/:roomId/tables', true, LobbyController.getRoomTables);
    __registerGetRoute('/v1/lobby/group/:groupId/tables', true, LobbyController.getGroupTables);
    __registerGetRoute('/v1/lobby/game/:tableId/playerDetails', true, LobbyController.getTablePlayerDetails);
    __registerPostRoute('/v1/lobby/group/:groupId/quickJoin', true, LobbyController.quickJoinGroup);
    __registerPostRoute('/v1/lobby/practice/group/:groupId/quickJoin', true, LobbyController.quickJoinPracticeGroup);
    __registerPostRoute('/v1/lobby/rooms/:roomId/reserve', true, LobbyController.reserveRoom);
    __registerPostRoute('/v1/lobby/practice/rooms/:roomId/reserve', true, LobbyController.reservePracticeRoom);
    __registerPostRoute('/v1/lobby/game/:tableId/join', true, LobbyController.joinTable);
    __registerPostRoute('/v1/lobby/practice/game/:tableId/join', true, LobbyController.joinPracticeTable);
    __registerPostRoute('/v1/lobby/game/:tableId/unreserve', true, TableController.playerUnreserveTable);
    __registerPostRoute('/v1/lobby/table/:tableId/open', true, LobbyController.openTable);
    __registerGetRoute('/v1/lobby/table/:tableId/details', true, LobbyController.getTableDetails)

    __registerGetRoute('/v1/lobby/tournament/:tournamentId/blindStructure', true, LobbyController.getTournamentBlindStructure)
    __registerGetRoute('/v3/lobby/tournament/:tournamentId/blindStructure', true, LobbyController.getTournamentBlindStructureV3)
    // __registerGetRoute('/v1/lobby/tournament/:tournamentId/details', true, LobbyController.getTournamentDetails)
    __registerGetRoute('/v2/lobby/tournament/:tournamentId/details', true, LobbyController.getTournamentDetailsV2)
    __registerGetRoute('/v3/lobby/tournament/:tournamentId/details', true, LobbyController.getTournamentDetailsV3)
    __registerGetRoute('/v3/tournament/:tournamentId/player/table/info', true, LobbyController.getTournamentPlayerTableInfo)
    __registerPostRoute('/v1/lobby/tournament/:tournamentId/register', true, LobbyController.registerPlayerForTournament)
    __registerPostRoute('/v3/lobby/tournament/:tournamentId/register', true, LobbyController.registerPlayerForTournamentV3)
    __registerPostRoute('/v1/lobby/tournament/:tournamentId/unregister', true, LobbyController.unregisterPlayerForTournament)
    __registerPostRoute('/v3/lobby/tournament/:tournamentId/unregister', true, LobbyController.unregisterPlayerForTournamentV3)
    __registerGetRoute('/v1/lobby/tournament/:tournamentId/player/status', true, LobbyController.getPlayerTournamentStatus)
    __registerGetRoute('/v1/lobby/tournament/player/mttList', true, LobbyController.getPlayerMTTList)
    // __registerGetRoute('/v1/lobby/tournament/mttList', true, LobbyController.getMTTList)
    __registerGetRoute('/v2/lobby/tournament/mttList', true, LobbyController.getMTTListV2)
    __registerGetRoute('/v3/lobby/tournament/mttList', true, LobbyController.getMTTListV3)
    // __registerGetRoute('/v1/lobby/tournament/:tournamentId/registrationPopupDetails', true, LobbyController.getRegistrationPopupDetails)
    __registerGetRoute('/v2/lobby/tournament/:tournamentId/registrationPopupDetails', true, LobbyController.getRegistrationPopupDetailsV2)
    __registerGetRoute('/v3/lobby/tournament/:tournamentId/registrationPopupDetails', true, LobbyController.getRegistrationPopupDetailsV3)
    __registerGetRoute('/v1/lobby/tournament/observing/tableId', true, LobbyController.getTournamentObserverTableIdByUsername)

    ////////////////////
    /// Table API's
    __registerPostRoute('/v1/game/:tableId/player/topup', true, TableController.playerTopupRequest);
    __registerPostRoute('/v1/practice/game/:tableId/player/topup', true, TableController.playerPracticeTopupRequest);
    __registerPostRoute('/v1/game/:tableId/player/joinback', true, TableController.playerJoinBack);
    __registerPostRoute('/v1/practice/game/:tableId/player/joinback', true, TableController.playerPracticeJoinBack);
    __registerPostRoute('/v1/tournament/game/:tournamentId/player/joinback', true, TableController.playerTournamentTableJoinBack);
    __registerPostRoute('/v1/game/:tableId/player/rebuy', true, TableController.playerRebuyRequest);
    __registerPostRoute('/v1/practice/game/:tableId/player/rebuy', true, TableController.playerPracticeRebuyRequest);
    __registerPostRoute('/v1/game/:tableId/player/leave', true, TableController.playerLeaveTable);
    __registerPostRoute('/v1/practice/game/:tableId/player/leave', true, TableController.playerLeaveTable);
    __registerPostRoute('/v1/tournament/game/:tournamentId/player/leave', true, TableController.playerTournamentLeaveTable);
    __registerPostRoute('/v1/game/:tableId/player/topup/values', true, TableController.getTopupValues);
    __registerPostRoute('/v1/practice/game/:tableId/player/topup/values', true, TableController.getPracticeTopupValues);
    __registerGetRoute('/v1/game/player/buyindetails', true, TableController.cashGameBuyInDetails);
    __registerGetRoute('/v1/game/:tableId/result', true, TableController.getCashTableResult);
    __registerGetRoute('/v1/practice/game/:tableId/result', true, TableController.getPracticeTableResult);
    __registerGetRoute('/v1/game/:tableId/player/:playerId/stats', true, TableController.getCashTableOtherPlayerStats);
    __registerGetRoute('/v1/practice/game/:tableId/player/:playerId/stats', true, TableController.getPracticeTableOtherPlayerStats);
    __registerGetRoute('/v1/game/:tableId/player/stats', true, TableController.getCashTablePlayerStats);
    __registerGetRoute('/v1/practice/game/:tableId/player/stats', true, TableController.getPracticeTablePlayerStats);
    __registerPostRoute('/v1/game/:tableId/player/sitout', true, TableController.playerSitOut);
    __registerPostRoute('/v1/practice/game/:tableId/player/sitout', true, TableController.playerPracticeSitOut);
    __registerPostRoute('/v1/tournament/game/:tournamentId/player/sitout', true, TableController.playerTournamentTableSitOut);
    __registerPostRoute('/v1/game/:tableId/reserveSeat', true, TableController.reserveSeat);
    __registerPostRoute('/v1/practice/game/:tableId/reserveSeat', true, TableController.practiceReserveSeat);
    __registerPostRoute('/v1/game/:roomId/joinsimilar', true, TableController.joinSimilarTable);
    __registerPostRoute('/v1/practice/game/:roomId/joinsimilar', true, TableController.practiceJoinSimilarTable);


    ////////////////////
    ///// User webhooks
    __registerPostRoute('/v1/user/:vendor/:conversionAction', false, AdminController.convertUserType);

    ////////////////////
    /// Invopice API's

    __registerGetRoute('/v1/invoices', true, InvoiceController.getInvoices)
    __registerGetRoute('/v1/invoices/download', true, InvoiceController.downloadInvoice)
    // __registerGetRoute('/v1/invoices/meta', true, InvoiceController.getInvoiceMeta)
    __registerGetRoute('/v2/invoices/meta', true, InvoiceController.getInvoiceMetaV2)

    // Affiliate API's
    __registerGetRoute('/v1/affiliate/users', true, AffiliateController.getAffiliateUsers);
    __registerGetRoute('/v1/affiliate/payments', true, AffiliateController.getAffiliatePayments);
    __registerPostRoute('/v1/affiliate/report', true, AffiliateController.generateAffiliateReport);
    __registerGetRoute('/v1/affiliate/meta', true, AffiliateController.getAffiliateMetaInfo);

    ////////////////////
    /// communication API's
    __registerGetRoute('/v1/gupshup/sms/:vendor/webhook', false, CommunicationController.processSmsWebhook);

    ////////////
    /// Chat APIs
    __registerGetRoute('/v1/chat/default/suggestions', true, LobbyController.getDefaultChatSuggestion);


    __registerPostRoute('/v1/leaderboard/settlement/tenet/webhook', false, LeaderboardController.processSettlementWebhook);
    __registerPostRoute('/v1/leaderboard/tenet/events', false, LeaderboardController.processLeaderboardEvent);
    __registerPostRoute('/v1/leaderboard/winning/gratification', false, LeaderboardController.sendLeaderboardWinnerGratification);

    __registerGetRoute('/v1/leaderboard/campaigns', true, LeaderboardController.getLeaderboardCampaigns);
    __registerGetRoute('/v1/leaderboard/child/room/:roomId', true, LeaderboardController.getLeaderboardOnTable);
    __registerGetRoute('/v1/leaderboard/hybrid/lobby', true, LeaderboardController.getLeaderboardForHybridLobby);
    __registerGetRoute('/v1/leaderboard/campaigns/:campaignTag/child', true, LeaderboardController.getLeaderboardsCardForCampaign);
    __registerGetRoute('/v1/leaderboard/game/stakes', true, LeaderboardController.getGameStakesConfig);
    __registerGetRoute('/v1/leaderboard/group/:groupId/child/:childId/details', true, LeaderboardController.getLeaderboardChildDetailsById);
    __registerGetRoute('/v1/leaderboard/group/:groupId/child/:childId/neighbour/details', true, LeaderboardController.getLeaderboardNeighbourDetails);
    __registerGetRoute('/v1/user/leaderboard/total/earnings', true, LeaderboardController.getUsersTotalLeaderboardEarnings);
    __registerGetRoute('/v1/leaderboard/faq', true, LeaderboardController.getLeaderboardFAQ);


    __registerGetRoute('/v1/users/tournament/info/bulk/', false, UserController.usersTournamentSettingsInfoBulk)


    //PSL APIS
    __registerGetRoute('/v1/psl/info', true, PslController.getPslInfoPageData);
    __registerGetRoute('/v1/psl/schedule', true, PslController.getPslSchedulePageData);
    __registerGetRoute('/v1/psl/leaderboard', true, PslController.getPslLeaderboardPageData);
    __registerPostRoute('/v1/psl/claim', true, PslController.claimPslTicket);
    __registerGetRoute('/v1/psl/claim/info', true, PslController.getUserPslTicketClaimStatus);

    return router;
};

function __registerPostRoute(route, isProtected, mainHandler, checkForMaliciousContent?) {
    var handlers = [];
    // Check for valid logged in user
    if (isProtected) {
        handlers.push(AuthController.checkLoggedInUserForApi);
    }
    handlers.push(bodyParser.text());
    handlers.push(bodyParser.urlencoded({extended: true}));
    handlers.push(bodyParser.json());
    if (checkForMaliciousContent) {
        handlers.push(requestHelper.sanitizeData);
    }
    handlers.push(mainHandler);
    router.post(route, handlers);
}

function __registerPutRoute(route, isProtected, mainHandler, checkForMaliciousContent?) {
    var handlers = [];
    // Check for valid logged in user
    if (isProtected) {
        handlers.push(AuthController.checkLoggedInUserForApi);
    }
    handlers.push(bodyParser.text());
    handlers.push(bodyParser.urlencoded({extended: true}));
    handlers.push(bodyParser.json());
    if (checkForMaliciousContent) {
        handlers.push(requestHelper.sanitizeData);
    }
    handlers.push(mainHandler);
    router.put(route, handlers);
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

function __registerDeleteRoute(route, isProtected, mainHandler, checkForMaliciousContent?) {
    var handlers = [];
    // Check for valid logged in user
    if (isProtected) {
        handlers.push(AuthController.checkLoggedInUserForApi);
    }
    handlers.push(bodyParser.text());
    handlers.push(bodyParser.urlencoded({extended: true}));
    handlers.push(bodyParser.json());
    if (checkForMaliciousContent) {
        handlers.push(requestHelper.sanitizeData);
    }
    handlers.push(mainHandler);
    router.delete(route, handlers);
}

export { apiRouter };
