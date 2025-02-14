import {logger} from "./logger";

export default class UserProfileUtils {

    public static async maskUserMobile(mobile: string): Promise<string> {
        logger.info(`[UserProfileUtils] [maskUserMobile] Masking mobile :: ${mobile}`);
        const maskedMobile: string = mobile.slice(0, 3) + mobile.slice(3).replace(/.(?=...)/g, '*');
        logger.info(`[UserProfileUtils] [maskUserMobile] mobile :: ${mobile} maskedMobile :: ${maskedMobile}`);
        return maskedMobile;
    }

}