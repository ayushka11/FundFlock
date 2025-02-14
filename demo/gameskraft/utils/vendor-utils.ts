import {APP_UNIQUE_CODE, CASH_APP, GMZ_VENDOR_ID, P52_VENDOR_ID} from "../constants/constants";

const configService = require("../services/configService");

export default class VendorUtil {

    static getVendorIdFromName(vendorName:string){
        const vendorMeta = configService.getVendorMeta();
        return vendorMeta?.vendorNameIdMap[vendorName];
    }

    static getVendorNameFromId(vendorId:string){
        const vendorMeta = configService.getVendorMeta();
        return vendorMeta?.vendorIdNameMap[vendorId];
    }

    static getAppUniqueCodeForVendor(vendorId: string, appType: string) {
        if(vendorId === P52_VENDOR_ID) {
            if(appType === CASH_APP) {
                return APP_UNIQUE_CODE.P52_NORMAL_APP;
            } else {
                return APP_UNIQUE_CODE.P52_PRACTICE_APP;
            }
        } else if(vendorId === GMZ_VENDOR_ID) {
            if(appType === CASH_APP) {
                return APP_UNIQUE_CODE.GMZ_NORMAL_APP;
            } else {
                return APP_UNIQUE_CODE.GMZ_PRACTICE_APP;
            }
        } else {
            return ""
        }
    }
}
