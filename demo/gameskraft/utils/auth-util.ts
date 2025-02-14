export const invalidMobileNumber = (mobile: string): boolean => {
    const regexExp = /^[6-9]\d{9}$/gi;
    return !regexExp.test(mobile);
}

export const validateVerifyOtp = (mobile: string,otp: number): boolean =>{
    return !(!mobile || !otp);
}

export const getDomainFromVendorId = (vendorId: string): string => {   
    switch (vendorId) {
        case '1':
            return 'domain.p52'
        case '8':
            return 'domain.gmz';
        default :
            return '';
    }
}
