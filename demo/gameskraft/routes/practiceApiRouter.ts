import AuthController from "../controllers/authController";
import UserController from '../controllers/userController';
import ZodiacController from "../controllers/zodiacController";
import SupernovaController from "../controllers/supernovaController";
import PlanetController from "../controllers/planetController";
import UserFeedbackController from "../controllers/userFeedbackController";
import HomeController from "../controllers/homeController";
import LobbyController from "../controllers/lobbyController";
import TableController from '../controllers/tableController';
import AppController from "../controllers/appController";
import ZodiacControllerV2 from '../controllers/v2/zodiacController';
import CommunicationController from '../controllers/communicationController';

const faqController = require("../controllers/faqController");
const requestHelper = require("../helpers/requestHelper");
const bodyParser = require('body-parser');
let router;

const practiceApiRouter = function (express) {
    router = express.Router();

    ////////////////////////// User Authentication APIs /////////////////////
    __registerPostRoute('/auth/logout', true, AuthController.logoutUser);
    __registerPostRoute('/auth/generateOtp', false, AuthController.generatePracticeAppOtp);
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
    ////////////////////////// User Details APIs ///////////////////////////////
    __registerGetRoute('/v2/user/summary', true, UserController.getPracticeUserSummaryV2);
    __registerGetRoute('/user/avatar', true, UserController.getUserAvatars);
    __registerPostRoute('/user/checkStatus', true, UserController.checkStatus);
    __registerGetRoute('/user/checkPermission', true, UserController.checkPermission);
    __registerGetRoute('/user/personal', true, UserController.getUserPersonal);
    __registerPostRoute('/user/personal', true, UserController.updateUserPersonal, true);
    __registerPostRoute('/user/personal/checkusername', true, UserController.checkUsername);
    __registerPostRoute('/user/verifyEmail', true, UserController.verifyEmail);

    ////////////////////
    /// APP CONFIG API's
    __registerGetRoute('/app/config', true, AppController.getPracticeAppConfig);
    __registerPostRoute('/user/packages', true, UserController.storeUserPackages);

    ////////////////////
    /// HOME API's
    __registerGetRoute('/v2/home/widgets', true, HomeController.getPracticeHomeScreenWidgetsV2);
    __registerGetRoute('/v1/home/learnPoker', true, HomeController.getPracticeAppLearnPoker);
    __registerGetRoute('/v1/widget/reward', true, HomeController.getPracticeAppDcsWidget);

    ////////////////////
    /// LOBBY API's
    __registerGetRoute('/v1/banners/lobby', false, LobbyController.getPracticeLobbyBanners);
    __registerGetRoute('/v1/lobby/config', true, LobbyController.getPracticeLobbyConfig);

    ////////////////////
    /// USER FEEDBACK API's
    __registerPostRoute('/v1/user/feedback', true, UserFeedbackController.pushUserFeedback);

    ////////////////////
    // FAQ APIs
    __registerGetRoute('/v1/faq', true, faqController.getPracticeFaq);

    ////////////////////
    // Wallet APIs
    __registerGetRoute('/v2/wallet/balance', true, SupernovaController.getPracticeBalanceV2);

    ///////////////////
    // Location APIs
    __registerGetRoute('/v1/user/location', true, PlanetController.getLocationDetails);
    // __registerGetRoute('/v1/location/restricted/states', true, PlanetController.getRestrictedStates);

    ////////////////////
    /// User Peripheral (Gameplay | Non Gameplay) APIs
    __registerGetRoute('/v1/user/practice/:tableId/hand/history/active', true, ZodiacController.getUserPracticeTableActiveHandHistory);
    __registerGetRoute('/v1/user/practice/hand/history', true, ZodiacController.getUserPracticeTableHandHistory);
    __registerGetRoute('/v1/user/practice/:tableId/hand/:handId/details', true, ZodiacController.getUserPracticeTableHandDetails);
    __registerGetRoute('/v1/user/hand/:handId/details', true, ZodiacController.getUserHandDetails);
    __registerGetRoute('/v1/user/stats', true, ZodiacController.getUserStats);
    __registerGetRoute('/v1/user/:userId/gameplay/stats', true, ZodiacController.getUserGameplayStats);



    __registerGetRoute('/v2/user/practice/:tableId/hand/history/active', true, ZodiacControllerV2.getUserPracticeHandsListByTableId);
    __registerGetRoute('/v2/user/practice/:tableId/hand/:handId/details', true, ZodiacControllerV2.getUserPracticeHandDetailsByHandId);

    ////////////////////
    // Policy Api routes
    __registerGetRoute('/v1/user/policy', true, ZodiacController.getUserPolicy);
    __registerPostRoute('/v1/user/policy/acknowledge', true, ZodiacController.createUserPolicyAcknowledgement);

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
    __registerGetRoute('/v1/lobby/rooms', true, LobbyController.getPracticeRooms);
    __registerGetRoute('/v1/lobby/groups', true, LobbyController.getPracticeGroups);
    __registerGetRoute('/v1/lobby/room/:roomId/tables', true, LobbyController.getRoomTables);
    __registerGetRoute('/v1/lobby/group/:groupId/tables', true, LobbyController.getGroupTables);
    __registerGetRoute('/v1/lobby/game/:tableId/playerDetails', true, LobbyController.getTablePlayerDetails);
    __registerPostRoute('/v1/lobby/practice/rooms/:roomId/reserve', true, LobbyController.reservePracticeRoom);
    __registerPostRoute('/v1/lobby/practice/game/:tableId/join', true, LobbyController.joinPracticeTable);
    __registerPostRoute('/v1/lobby/game/:tableId/unreserve', true, TableController.playerUnreserveTable);
    __registerPostRoute('/v1/lobby/table/:tableId/open', true, LobbyController.openTable);
    __registerPostRoute('/v1/lobby/practice/group/:groupId/quickJoin', true, LobbyController.quickJoinPracticeGroup);


    ////////////////////
    /// Table API's
    __registerPostRoute('/v1/practice/game/:tableId/player/topup', true, TableController.playerPracticeTopupRequest);
    __registerPostRoute('/v1/practice/game/:tableId/player/joinback', true, TableController.playerPracticeJoinBack);
    __registerPostRoute('/v1/practice/game/:tableId/player/rebuy', true, TableController.playerPracticeRebuyRequest);
    __registerPostRoute('/v1/game/:tableId/player/leave', true, TableController.playerLeaveTable);
    __registerPostRoute('/v1/practice/game/:tableId/player/topup/values', true, TableController.getPracticeTopupValues);
    __registerGetRoute('/v1/practice/game/:tableId/result', true, TableController.getPracticeTableResult);
    __registerGetRoute('/v1/practice/game/:tableId/player/:playerId/stats', true, TableController.getPracticeTableOtherPlayerStats);
    __registerGetRoute('/v1/practice/game/:tableId/player/stats', true, TableController.getPracticeTablePlayerStats);
    __registerPostRoute('/v1/practice/game/:tableId/player/sitout', true, TableController.playerPracticeSitOut);
    __registerPostRoute('/v1/practice/game/:tableId/reserveSeat', true, TableController.practiceReserveSeat);
    __registerPostRoute('/v1/practice/game/:roomId/joinsimilar', true, TableController.practiceJoinSimilarTable);

    ////////////////////
    /// communication API's
    __registerGetRoute('/v1/gupshup/sms/:vendor/webhook', false, CommunicationController.processSmsWebhook);
    __registerGetRoute('/v1/sendAppDownloadSms', true, CommunicationController.sendAppDownloadSms);

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


export {practiceApiRouter};
