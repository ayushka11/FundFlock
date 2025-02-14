const defaultErrorCode = require('../helpers/responseHelper').DEFAULT_ERROR_CODE;
const __errorCodes = require('../constants/constants').__errorCodes;
import { PopupType } from "../models/enums/popup-type";

export const ERRORDETAILS = {
  // Default error message. If some error code does not have a message.
  [defaultErrorCode]: () => {
    return {}
  },
  [__errorCodes.InsufficientFunds]: () => {
    return {
      showPopup: true,
      popupType: PopupType.INSUFFICIENT_FUNDS
    }
  },
  [__errorCodes.InsufficientFundsAries]: () => {
    return {
      showPopup: true,
      popupType: PopupType.INSUFFICIENT_FUNDS
    }
  },
  [__errorCodes.InsufficientFundsSupernova]: () => {
    return {
      showPopup: true,
      popupType: PopupType.INSUFFICIENT_FUNDS
    }
  },

};
