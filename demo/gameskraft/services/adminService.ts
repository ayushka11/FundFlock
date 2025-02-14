import { AdminServiceConstants } from "../constants/admin-service-constants";
import { NEW_USER_PRACTICE_BALANCE } from "../constants/constants";
import { USER_CATEGORY, USER_TYPE } from "../constants/idm-constants";
import IDMServiceErrorUtil from "../errors/idm/idm-error-util";
import { IDMUserProfile } from "../models/idm/user-idm";
import { TenetCustomerDetails } from "../models/payin/user-details";
import { CreateUserRequest } from "../models/zodiac/create-user-request";
import { md5hash } from "../utils/crypto-util";
import IdmUtil from "../utils/idm-utils";
import LoggerUtil, {ILogger} from "../utils/logger";
import IDMService from "./idmService";
import PayinService from "./payinService";
import ReferralService from "./referralService";
import SupernovaService from "./supernovaService";
import ZodiacService from "./zodiacService";
const configService = require("../services/configService");
const logger: ILogger = LoggerUtil.get("AdminService");

export default class AdminService {

    static async convertUserType(restClient: any, userDetails: IDMUserProfile,conversionAction: string,vendorId: number): Promise<any> {
        try {
            let response: any = {};
            if(conversionAction == AdminServiceConstants.USER_CONVERSION.ONBOARD){
                userDetails.category = USER_CATEGORY.EMPLOYEE;
                response = await this.createNewSystemUser(restClient,userDetails,vendorId);
            }
            return response;
        } catch (error) {
            logger.error(error, `[AdminService] [convertUserType] Failed`);
            throw error;
        }
    }

    static async createNewSystemUser(restClient: any,userDetails: IDMUserProfile,vendorId: number){
        try{
        logger.info('creating the new user for onboarding')
        if (!IdmUtil.validateMobileNumber(userDetails?.mobile)) {
            const invalidMobileError = IDMServiceErrorUtil.getInvalidMobileFormat();
            logger.info(`Invalid Mobile Format ${JSON.stringify(invalidMobileError)}`);
            throw invalidMobileError;
        }
        let userProfile: IDMUserProfile = await IDMService.checkUserDetails(restClient, userDetails.mobile, `${vendorId}`);
        let payinTenetCustomerId: string = userProfile?.customAttributes?.payinTenetCustomerId;
        let isNewUser : boolean = false;
        if(userProfile)
            return userProfile
        
        // NEW USER - Go for Signup flow
        isNewUser = true;
        logger.info("create new user - New User -- Registration flow for the new user");
        // create a idm profile here
        userProfile =  await IDMService.postCreateUser(restClient,userDetails,`${vendorId}`);
        const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
            mobile: userDetails.mobile,
            uniqueRef: userProfile.userId,
        }, restClient, `${vendorId}`);
        payinTenetCustomerId = payinUserDetails?.tenetCustomerId;
        const avatars = configService.getUserAvatarsForVendor()[vendorId];
        const defaultUsername = await IdmUtil.getDefaultUsername(userProfile.userId);
        
        logger.info(`[createNewSystemUser] defaultUsername - ${defaultUsername}`)
        const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar;
        logger.info(`[createNewSystemUser] defaultUserAvatar - ${defaultUserAvatar}`)
        let updateUser: IDMUserProfile = {
            clientIdentifier: `${vendorId}_${userProfile.userId}`,
            userUuid: md5hash(`${vendorId}_${userDetails.mobile}`),
            userId: userProfile.userId,
            displayPicture: defaultUserAvatar,
            customAttributes: {
                payinTenetCustomerId: payinTenetCustomerId || '',
                usernameEditable: isNewUser,
                vendorUniqueUserId: '',
                userTypes: USER_TYPE.NORMAL_USER.toString(),
            },
            userHandle: defaultUsername,
            displayName: defaultUsername,
        };
        const userUpdateIdm = IDMService.updateUser(restClient, updateUser, `${vendorId}`);
        const createUserAccount = SupernovaService.createUserAccount(restClient, {
            userId: userProfile.userId,
            practiceBalance: NEW_USER_PRACTICE_BALANCE
        }, Number(vendorId));
        const createUserRequest: CreateUserRequest = {
            hasMigratedToApollo: true,
            showApolloUpdate: true,
            createdDirectlyOnApollo: true
        }
        const createZodiacUser = ZodiacService.createUser(restClient, `${vendorId}_${userProfile.userId}`, createUserRequest);

        //  Create New User's ReferCode
        const createUserReferCode = ReferralService.createUserReferCode(restClient, userProfile.userId);

        const [createUserAccRes, userUpdateResponse, zodiacResponse, createUserReferCodeResponse] = await Promise.all([createUserAccount, userUpdateIdm, createZodiacUser, createUserReferCode]);

        logger.info(`[AdminService] [createNewSystemUser] userId :: ${userProfile.userId} referCodeResp :: ${JSON.stringify(createUserReferCodeResponse)}`);


        // Get latest Userdetails after update
        userDetails = await IDMService.getUserDetails(restClient, `${userProfile.userId}`, `${vendorId}`);
    
        return userDetails;
        } catch(e){
            throw(e);
        }

    }

}