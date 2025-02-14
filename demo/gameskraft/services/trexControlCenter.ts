import crypto from "crypto"
import TrexControlCenterClient from '../clients/trexControlCenterClient';
import {GS_TOKEN_TTL} from "../constants/constants";
import {logger} from "../utils/logger";

export default class TrexControlCenter {

    static async getToken(userId, userName, mobile, vendorId, domain, restClient) {
        try {
            const hash_a = crypto.createHash("md5").update(mobile, "utf8").digest("hex")
            const hash_b = ""

            const tokenSessionData = {
                id: `${vendorId}_${userId}`,
                name: userName,
                domain: domain,
                hash_a: hash_a,
                hash_b: hash_b,
                ttl: GS_TOKEN_TTL,
            }

            const trexSessionToken = await TrexControlCenterClient.getLoginSessionToken(tokenSessionData, restClient);
            return trexSessionToken;
        } catch (error) {
            logger.info(error, `Error in TrexControlCenter getToken`);
            throw error;
        }
    }

    static async refreshToken(token, restClient) {
        try {
            const refreshData = {
                token: token,
                ttl: GS_TOKEN_TTL,
            }

            const trexSessionToken = await TrexControlCenterClient.refreshToken(refreshData, restClient);
            return trexSessionToken;
        } catch (error) {
            logger.info(error, `Error in TrexControlCenter refreshToken`);
            throw error;
        }
    }

    static async validateToken(token, restClient) {
        try {
            const tokenData = {
                token: token
            }

            const trexSessionToken = await TrexControlCenterClient.validateToken(tokenData, restClient);
            return trexSessionToken;
        } catch (error) {
            logger.info(error, `Error in TrexControlCenter validateToken`);
            throw error;
        }
    }

    static async logout(token, restClient) {
        try {
            const data = {
                token: token,
            }

            const trexSessionToken = await TrexControlCenterClient.logout(data, restClient);
            return trexSessionToken;
        } catch (error) {
            logger.info(error, `Error in TrexControlCenter logout`);
            throw error;
        }
    }
}


