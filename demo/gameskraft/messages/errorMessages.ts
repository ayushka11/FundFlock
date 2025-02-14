import IDMErrorCodes from "../errors/idm/idm-error-codes";
import GuardianErrorCodes from "../errors/guardian/guardian-error-codes";

const defaultErrorCode = require('../helpers/responseHelper').DEFAULT_ERROR_CODE;
const configService = require('../services/configService');

export const MESSAGES = {
  // Default error message. If some error code does not have a message.
  [defaultErrorCode]: () => {
    return 'Error. Please try again.'
  },

  // [authErrorCodes.SystemMaintenanceInProgress] : () => { return 'System Maintenance is in progress. Please try after some time.'},

  [IDMErrorCodes.IncorrectPassword]: () => {
    return 'Your account or password is incorrect. Don\'t remember it? click Forgot Password link below.'
  },
  [IDMErrorCodes.InvalidEmailFormat]: () => {
    return 'Invalid email. Please provide a valid email address.'
  },
  [IDMErrorCodes.EmailNotPresent]: () => {
    return 'Unable to fetch Email address. Please share your email while logging in.'
  },
  [IDMErrorCodes.EmailNotRegistered]: () => {
    return 'This email is not registered. Want to register? Click REGISTER on top.'
  },
  [IDMErrorCodes.MobileNotRegistered]: () => {
    return 'This mobile is not registered. Want to register? Click REGISTER on top.'
  },
  [IDMErrorCodes.EmailOrMobileRequired]: () => {
    return 'Please enter your Email or Mobile above.'
  },
  [IDMErrorCodes.PasswordNecessary]: () => {
    return 'Please enter your Password above.'
  },
  [IDMErrorCodes.UserAccountBlocked]: () => {
    return 'Your account has been temporarily blocked. Please reach out to our support team for assistance.'
  },
  [IDMErrorCodes.OtpMismatch]: () => {
    return 'The OTP entered is invalid. Please try again.'
  },
  [IDMErrorCodes.OtpExpired]: () => {
    return 'The OTP has expired. Please generate a new OTP to proceed.'
  },
  [IDMErrorCodes.FacebookTokenAlreadyExist]: () => {
    return 'Already logged in via Facebook'
  },
  [IDMErrorCodes.GoogleTokenAlreadyExist]: () => {
    return 'Already logged in via Google'
  },
  [IDMErrorCodes.MobileAlreadyExistWithEmailVerified]: () => {
    return 'Mobile number already exists with Email verified'
  },
  [IDMErrorCodes.MultipleUsersFound]: () => {
    return 'We are facing some issues, please try logging by mobile number or email id"'
  },
  [IDMErrorCodes.EmailAlreadyExist]: () => {
    return 'Email ID is already in use.'
  },
  [IDMErrorCodes.MobileAlreadyExist]: () => {
    return 'Sorry this mobile is already registered.'
  },
  [IDMErrorCodes.InvalidEmailFormat]: () => {
    return 'Invalid email format. Please provide a valid email address.'
  },
  [IDMErrorCodes.InvalidMobileFormat]: () => {
    return 'Invalid mobile number. Please provide a valid 10 digit mobile number.'
  },
  [IDMErrorCodes.DisplayNameNecessary]: () => {
    return 'Display name is mandatory. Please provide a valid display name.'
  },
  [IDMErrorCodes.InvalidDisplayName]: () => {
    return 'Invalid display name. Please provide only English alpha numeric name.'
  },
  [IDMErrorCodes.InvalidPanId]: () => {
    return 'Invalid PAN format. Please provide a valid PAN number.'
  },
  [IDMErrorCodes.PanAlreadyExist]: () => {
    return 'Sorry this PAN is already registered.'
  },
  [IDMErrorCodes.AgeLessThan_18]: () => {
    return 'Age cannot be less than 18 years.'
  },
  [IDMErrorCodes.DisplayNameAlreadyTaken]: () => {
    return 'This name is already in use.'
  },
  [IDMErrorCodes.DisplayNameTooShort]: () => {
    return 'Display name should be between 3 to 10 characters.'
  },
  [IDMErrorCodes.DisplayNameTooLong]: () => {
    return 'Display name should be between 3 to 10 characters.'
  },
  [IDMErrorCodes.DisplayNameContainsSwearWord]: () => {
    return 'This Display Name not allowed. Please choose an appropriate one.'
  },
  [IDMErrorCodes.DisplayNameShouldHaveOneAlphabet]: () => {
    return 'Display Name must have at least one alphabet'
  },
  [IDMErrorCodes.PanNotVerified]: () => {
    return 'PAN Not Verified'
  },
  [IDMErrorCodes.UpiAlreadyExist]: () => {
    return 'UPI already in use'
  },
  // [IDMErrorCodes.InvalidUpiId] : () => { return 'Invalid Upi Id'},
  [IDMErrorCodes.InvalidIfsc]: () => {
    return 'Invalid IFSC format. Please provide a valid IFSC.'
  },
  [IDMErrorCodes.BankAccountBlacklistedCode]: () => {
    return 'This bank account is already in use.'
  },
  [IDMErrorCodes.BankDetailsAlreadyVerified]: () => {
    return 'This bank account is already verified.'
  },
  [IDMErrorCodes.MobileUpdateNotAllowedAlreadyVerified]: () => {
    return 'Update not allowed for already verified mobile.'
  },
  [IDMErrorCodes.InvalidReferralInfo]: () => {
    return "Invalid Referral code"
  },

  [GuardianErrorCodes.PanIdNotFoundOnSource]: () => {
    return 'Invalid PAN format. Please provide a valid PAN number.'
  },
  [GuardianErrorCodes.SameDetailsVerifiedAlreadyVerified]: () => {
    return 'Sorry this PAN is already registered.'
  },
  [GuardianErrorCodes.MinorDobPan]: () => {
    return 'Age cannot be less than 18 years.'
  },
  [GuardianErrorCodes.InvalidUpi] : () => {
      return 'Invalid Upi Id'
  },
  [GuardianErrorCodes.InvalidIfsc]: () => {
    return 'Invalid IFSC format. Please provide a valid IFSC.'
  },
};
