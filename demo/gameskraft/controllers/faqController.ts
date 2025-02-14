import {APP_FAQ,PRACTICE_APP_FAQ} from "../constants/faqs";

const getFaq = (req, res, next) => {
    const vendorId: string = req?.vendorId;
    res.responseManager.sendSuccess(APP_FAQ[vendorId]);
};

const getPracticeFaq = (req, res, next) => {
    const vendorId: string = req?.vendorId;
    res.responseManager.sendSuccess(PRACTICE_APP_FAQ[vendorId]);
};

module.exports = {
    getFaq,
    getPracticeFaq,
};