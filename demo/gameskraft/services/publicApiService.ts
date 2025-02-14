import LoggerUtil from "../utils/logger";
import { getAppVideosForVendor, getPracticeAppVideos } from "./configService";

const communicationService = require("../services/communicationService");

const logger = LoggerUtil.get("PublicApiService");

export default class PublicApiService {

    static async getAppVideos(restClient: any, vendorId: string, screen: string): Promise<any> {
        try {
            logger.info(`[getAppVideos] vendorId :: ${vendorId}, screen :: ${screen}`);
            const allAppVideos: any = getAppVideosForVendor();
            logger.info(`[getAppVideos] allAppVideos :: ${JSON.stringify(allAppVideos)}`);
            const vendorAppVideos: any = allAppVideos[vendorId];
            const vendorScreenAppVideo: any = vendorAppVideos[screen];
            return vendorScreenAppVideo
        } catch (e) {
            logger.info(e, `[getAppVideos] Failed `);
            throw (e);

        }
    }

    static async getPracticeAppVideos(screen: string, vendorId: string): Promise<any> {
        try {
            logger.info(`[getPracticeAppVideos] screen :: ${screen}`);
            const practiceAppVideos: any = getPracticeAppVideos()[vendorId];
            logger.info(`[getPracticeAppVideos] practiceAppVideos :: ${JSON.stringify(practiceAppVideos)}`);
            const vendorScreenAppVideo: any = practiceAppVideos[screen];
            return vendorScreenAppVideo
        } catch (e) {
            logger.info(`[getPracticeAppVideos] Failed ${JSON.stringify(e)}`);
            throw (e);
        }
    }

    static async sendAppDownloadLink(req: any, mobile: string, vendorId: string, isRummy: boolean): Promise<any> {
        try {
            logger.info(`[sendAppDownloadLink] vendorId :: ${vendorId}, Mobile :: ${mobile}`);
            communicationService.sendAppDownloadLink(
                req.internalRestClient,
                mobile,
                vendorId,
                isRummy,
                function (err, data) {
                    if (err) {
                        logger.error(err, 'Error from communicationService.sendAppDownloadLink in publicApiService sendAppDownloadLink');
                        return;
                    }

                    logger.info({data}, `Successfully send SMS to mobile ${mobile} from publicApiService sendAppDownloadLink`);
                });
            return {};
        } catch (e) {
            logger.info(`[sendAppDownloadLink] Failed ${JSON.stringify(e)}`);
            throw (e);
        }
    }

}