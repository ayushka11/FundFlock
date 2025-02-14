import { AdminServiceConstants } from "../constants/admin-service-constants";
import RequestUtil from "../helpers/request-util";
import AdminService from "../services/adminService";
import ResponseUtil from "../utils/response-util";
import VendorUtil from "../utils/vendor-utils";
import LoggerUtil, {ILogger} from '../utils/logger';
import ServiceError from "../errors/service-error";
const logger: ILogger = LoggerUtil.get("AdminController");

export default class AdminController {
    static async convertUserType(req,res,next): Promise<any> {
        try {
            const {params,body} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, AdminServiceConstants.ADMIN_SERVICE_REQUEST_PARAM.VENDOR);
            const {mobile,email} = body;
            if(!mobile){
                throw(ServiceError.MISSING_MOBILE_ERROR);
            }
            const conversionAction: string = RequestUtil.parseQueryParamAsString(params,AdminServiceConstants.ADMIN_SERVICE_REQUEST_PARAM.CONVERSION_ACTION);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`got request to convert userMobile : ${mobile} to ${conversionAction} for the vendor ${vendorId}`);
            const conversionResponse: any = await AdminService.convertUserType(req.internalRestClient, {mobile,email},conversionAction,vendorId);
            return ResponseUtil.sendSuccessResponse(res, {conversionResponse});
        } catch (error) {
            logger.info(error,'got error from [convertUserType]')
            next(error);
        }
    }
}