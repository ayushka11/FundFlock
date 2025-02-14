export class AdminServiceConstants{
    static ADMIN_SERVICE_REQUEST_PARAM = {
        VENDOR:'vendor',
        USER_ID: 'userId',
        CONVERSION_ACTION: 'conversionAction'
    }

    static USER_CONVERSION_TYPE = {
        'onboard' : 2,
        'offboard' : 1
    }

    static USER_CONVERSION = {
        ONBOARD : 'onboard',
        OFFBOARD : 'offboard'
    }

    static ADMIN_SERVICE_VALIDATION_ERRORS = {
        MISSING_MOBILE: {
            name: 'MOBILE_NUMBER_MISSING',
            code: 1001,
            message: 'mobile needs to be present.'
        }
    }
}