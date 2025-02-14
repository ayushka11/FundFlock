import {LoginWithPasswordPayload, UpdatePasswordPayload, VerifyOtpPayload} from "../models/idm/request-response";
import {IDMUserProfile} from "../models/idm/user-idm";
import {USER_CATEGORY, USER_TYPE} from "../constants/idm-constants";
import { FileUtil } from "./file-util";
const path = require('path');
import LoggerUtil, { ILogger } from '../utils/logger';
import { VerifyOtpRequest } from "../models/request/auth";
const logger: ILogger = LoggerUtil.get("IDMUtil");


export default class IdmUtil {

    static validateMobileNumber(mobile: string): boolean {
        const regexExp = /^[6-9]\d{9}$/gi;
        return regexExp.test(mobile);
    }

    static validateGetUserService(clientIdentifier: string, vendorId: number):boolean{
        return !(!clientIdentifier || !vendorId);
    }

    static createVerifyOtpPayload(key: string, otp: string, context: number): VerifyOtpPayload {
        return {key, otp, context}
    }

    /*
            userId - unique across all suborgs
            userUuid - hash of vendorId_mobile for P52
                     - hash of vendorId_userUniqueId for other vendors
               userUuid is immutable, so this decision is taken
            clientIdentifier - vendorId_userId - Its also network id used by other vendors

            customAttributes -
                            payinTenetCustomerId - payin's tenet customer id created on registration
                            vendorId - same as suborgid - is this required?
                            vendorUniqueUserId - vendors unique userId - unhashed version of userUuid
                            usernameEditable - whether username is editable for the user
     */

    static createLoginWithPasswordPayload(key: string, password: string): LoginWithPasswordPayload{
        return {key, password}
    }

    static createUpdatePasswordPayload(key: string, password: string, context: number): UpdatePasswordPayload{
        return {key, password, context}
    }

    static getAddCashBan(userDetails: IDMUserProfile): boolean {
        let userTypes: string | undefined = userDetails?.customAttributes?.userTypes;
        if(userTypes === null || userTypes === undefined ){
            // If userType is null, then no ban
            return false;
        } else {
            // Split the existing userType string into an array of integers
            const existingUserType: number[] = userTypes.split(',').map(Number);

            return existingUserType.includes(USER_TYPE.ADD_CASH_BAN);
        }
    }

    static getWithdrawalBan(userDetails: IDMUserProfile): boolean {
        let userTypes: string | undefined = userDetails?.customAttributes?.userTypes;
        if(userTypes === null || userTypes === undefined ){
            // If userType is null, then no ban
            return false;
        } else {
            // Split the existing userType string into an array of integers
            const existingUserType: number[] = userTypes.split(',').map(Number);

            return existingUserType.includes(USER_TYPE.WITHDRAWAL_BAN) || userDetails.category == USER_CATEGORY.EMPLOYEE  || existingUserType.includes(USER_TYPE.INTERNAL_USER);
        }
    }

    static getPromosBan(userDetails: IDMUserProfile): boolean {
        let userTypes: string | undefined = userDetails?.customAttributes?.userTypes;
        if(userTypes === null || userTypes === undefined ){
            // If userType is null, then no ban
            return false;
        } else {
            // Split the existing userType string into an array of integers
            const existingUserType: number[] = userTypes.split(',').map(Number);

            return existingUserType.includes(USER_TYPE.PROMOS_BAN);
        }
    }

    static getGameplayBan(userDetails: IDMUserProfile): boolean{
        let userTypes: string | undefined = userDetails?.customAttributes?.userTypes;
        if(userTypes === null || userTypes === undefined ){
            // If userType is null, then no ban
            return false;
        } else {
            // Split the existing userType string into an array of integers
            const existingUserType: number[] = userTypes.split(',').map(Number);

            return existingUserType.includes(USER_TYPE.GAMEPLAY_BAN) || userDetails.category == USER_CATEGORY.EMPLOYEE || existingUserType.includes(USER_TYPE.INTERNAL_USER);
        }
    }

    static getChatBan(userDetails: IDMUserProfile): boolean{
        let userTypes: string | undefined = userDetails?.customAttributes?.userTypes;
        if(userTypes === null || userTypes === undefined ){
            // If userType is null, then no ban
            return false;
        } else {
            // Split the existing userType string into an array of integers
            const existingUserType: number[] = userTypes.split(',').map(Number);

            return existingUserType.includes(USER_TYPE.CHAT_BAN);
        }
    }

    static getLoginBan(userDetails: IDMUserProfile): boolean{
        let userTypes: string | undefined = userDetails?.customAttributes?.userTypes;
        if(userTypes === null || userTypes === undefined ){
            // If userType is null, then no ban
            return false;
        } else {
            // Split the existing userType string into an array of integers
            const existingUserType: number[] = userTypes.split(',').map(Number);

            return existingUserType.includes(USER_TYPE.LOGIN_BAN);
        }
    }

    private static toHex(input: number) {
        let hash = "";
        const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";
        const alphabetLength = alphabet.length;

        do {
            hash = alphabet[input % alphabetLength] + hash;
            input = parseInt(`${input / alphabetLength}`, 10);
        } while (input);

        return hash;
    }

    static async getDefaultUsername(userId: number) {
        const userIdHash = this.toHex(userId);
        const preGenerateUsername = await IdmUtil.getPreGeneratedUsername();
        const username = `${preGenerateUsername}_${userIdHash}`;
        return username;
    }

    static async getPreGeneratedUsername(){
        const DEFAULT_USERNAME_FILE = path.join(__dirname, `../../default-username.json`);
        const usernames = await FileUtil.readJsonFile(DEFAULT_USERNAME_FILE);
        if (usernames.length === 0) {
            logger.error('No usernames found in the JSON file.');
            return 'user';
        }
        const randomIndex = Math.floor(Math.random() * usernames.length);
        const randomUsername = usernames[randomIndex];
        return randomUsername ? randomUsername : 'user';
    }

    static getDefaultAvatar(avatars: string[]): string {
        const randomIndex = Math.floor(Math.random() * avatars.length);
        return avatars[randomIndex];
    }

}
