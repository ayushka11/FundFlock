import {
    CURRENCY,
    CURRENCY_SYMBOLS,
    ONE_CRORE,
    ONE_LAKH,
    ONE_THOUSAND,
    TOURNAMENT_CURRENCY_SYMBOLS
} from '../constants/constants';
import {IAmountData} from "../models/amount-data";
import {TournamentCurrencyType} from "../models/enums/tournament/tournament-currency-type";

export default class AmountUtil {

    /*
    * Returns amount with two decimal place for fraction numbers and no decimal place for integers.
    * E.g. 18.5 => 18.50 and 17.0 => 17
    * */
    static getFormattedAmount = (amount: number) => {
        const result = (amount - Math.floor(amount)) !== 0;
        if (result) {
            return Number(amount).toFixed(2);
        }
        else {
            return Number(amount);
        }
    }

    static getAbsoluteFormattedAmount = (amount: number) => {
        const absAmount = Math.abs(amount);
        const result = (absAmount - Math.floor(absAmount)) !== 0;
        if (result) {
            return Number(absAmount).toFixed(2);
        }
        else {
            return Number(absAmount);
        }
    }

    static getAmountDoubleDecimal = (amount: number) => {
        return Number.isInteger(amount) ? Number(amount) : Number(amount).toFixed(2);
    }

    static getAmountSingleDecimal = (amount: number) => {
        return Number.isInteger(amount) ? Number(amount) : Number(amount).toFixed(1);
    }

    static getAmountWithCurrency = (amount: number, currency?: number, amountInBB?: string): IAmountData => {
        if (!isNaN(amount)) {
            const roundedOffAmount: number = Number(AmountUtil.getAmountDoubleDecimal(amount))
            switch (currency) {
                case CURRENCY.INR:
                    return {
                        value: roundedOffAmount,
                        text: `${CURRENCY_SYMBOLS.INR}${roundedOffAmount}`,
                        currency: CURRENCY.INR,
                        valueInBB: amountInBB
                    }
                case CURRENCY.CHIPS:
                    return {
                        value: roundedOffAmount,
                        text: `${roundedOffAmount}`,
                        currency: CURRENCY.CHIPS,
                        valueInBB: amountInBB
                    }
                default:
                    return {
                        value: roundedOffAmount,
                        text: `${roundedOffAmount}`,
                        currency: CURRENCY.CHIPS,
                        valueInBB: amountInBB
                    }
            }
        }
        else {
            return;
        }
    }

    static getFloorAmountWithCurrency = (amount: number, currency: number, amountInBB?: string): IAmountData => {
        if (!isNaN(amount)) {
            const roundedOffAmount: number = Number(Math.floor(amount))
            switch (currency) {
                case CURRENCY.INR:
                    return {
                        value: roundedOffAmount,
                        text: `${CURRENCY_SYMBOLS.INR}${roundedOffAmount}`,
                        currency: CURRENCY.INR,
                        valueInBB: amountInBB
                    }
                case CURRENCY.CHIPS:
                    return {
                        value: roundedOffAmount,
                        text: `${roundedOffAmount}`,
                        currency: CURRENCY.CHIPS,
                        valueInBB: amountInBB
                    }
            }
        }
        else {
            return;
        }
    }

    static getAmountWithComma = (amount: number, currency: number, amountInBB?: string): IAmountData => {
        if (!isNaN(amount)) {
            const roundedOffAmount: number = Number(AmountUtil.getAmountDoubleDecimal(amount));
            let amountString: string = `${roundedOffAmount}`;
            let commaIndex = 3;
            let resultSrting: string = '';
            for (let i = amountString.length; i >= 1; i--) {
                if ((i + commaIndex) === (amountString.length)) {
                    resultSrting = ',' + resultSrting;
                    commaIndex += 2;
                }
                resultSrting = amountString[i - 1] + resultSrting;
            }

            switch (currency) {
                case CURRENCY.INR:
                    return {
                        value: roundedOffAmount,
                        text: `${CURRENCY_SYMBOLS.INR}${resultSrting}`,
                        currency: CURRENCY.INR,
                        valueInBB: amountInBB
                    }
                case CURRENCY.CHIPS:
                    return {
                        value: roundedOffAmount,
                        text: `${resultSrting}`,
                        currency: CURRENCY.CHIPS,
                        valueInBB: amountInBB
                    }
            }

        }
        else {
            return;
        }
    }

    static getAmountWithBeauty = (amount: number, currency: number, amountInBB?: string): IAmountData => {
        if (!isNaN(amount)) {
            const roundedOffAmount: number = Number(AmountUtil.getAmountDoubleDecimal(amount));
            let amountString: string = `${roundedOffAmount}`;
            if (Math.floor(roundedOffAmount / ONE_THOUSAND) > 0) {
                if (Math.floor(roundedOffAmount / ONE_LAKH) > 0) {
                    if (Math.floor(roundedOffAmount / ONE_CRORE) > 0) {
                        amountString = `${Number(AmountUtil.getAmountDoubleDecimal(roundedOffAmount / ONE_CRORE))}Cr`;
                    }
                    else {
                        amountString = `${Number(AmountUtil.getAmountDoubleDecimal(roundedOffAmount / ONE_LAKH))}L`;
                    }
                }
                else {
                    amountString = `${Number(AmountUtil.getAmountDoubleDecimal(roundedOffAmount / ONE_THOUSAND))}K`;
                }
            }

            switch (currency) {
                case CURRENCY.INR:
                    return {
                        value: roundedOffAmount,
                        text: `${CURRENCY_SYMBOLS.INR}${amountString}`,
                        currency: CURRENCY.INR,
                        valueInBB: amountInBB
                    }
                case CURRENCY.CHIPS:
                    return {
                        value: roundedOffAmount,
                        text: `${amountString}`,
                        currency: CURRENCY.CHIPS,
                        valueInBB: amountInBB
                    }
            }

        }
        else {
            return;
        }
    }

    static roundTo2(amount: number | string): number {
        return Number.isInteger(amount) ? parseInt(String(amount), 10) : Number(Number(amount).toFixed(2));
    }

    static addCommaToNumber(v: number) {
        const neg = v >= 0 ? '' : '-';
        let x = v.toString().replace(/-/, '');
        let afterPoint = '';
        if (x.indexOf('.') > 0) afterPoint = x.substring(x.indexOf('.'), x.length);
        x = Math.floor(parseFloat(x)).toString();
        let lastThree = x.substring(x.length - 3);
        const otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') lastThree = `,${lastThree}`;
        return neg + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint;
    }

    static moneyConvert(val?: number) {
        if (val === 0) return 0;
        if (!val || Number.isNaN(val)) return "-";
        if (val <= -1000 && val > -100000) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 1000))}K`;
        }
        if (val <= -100000 && val > -10000000) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 100000))} L`;
        }
        if (val <= -10000000) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 10000000))} Cr`;
        }
        if (val >= 1000 && val < 100000) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 1000))}K`;
        }
        if (val >= 100000 && val < 10000000) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 100000))} L`;
        }
        if (val >= 10000000) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 10000000))} Cr`;
        }
        return AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val));
    }

    static moneyConvertToK(val: number) {
        if (val > 99999.99) {
            return `${AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val / 1000))}K`;
        }
        return AmountUtil.addCommaToNumber(AmountUtil.roundTo2(val));
    }

    static getAmountFromPercent = (amount: number, percent: number): number => {

        return AmountUtil.roundTo2(((amount ?? 0) * percent) / 100)
    }

    static getAmountWithTournamentCurrency = (amount: number, currency: TournamentCurrencyType, isOverlay: boolean): IAmountData => {
        if (!isNaN(amount)) {
            switch (currency) {
                case TournamentCurrencyType.WS:
                    return {
                        value: amount,
                        text: isOverlay ? `${AmountUtil.moneyConvert(amount)}` : `${TOURNAMENT_CURRENCY_SYMBOLS.WS}${AmountUtil.moneyConvert(amount)}`,
                        currency: CURRENCY.INR
                    }
                case TournamentCurrencyType.TDC:
                    return {
                        value: amount,
                        text: isOverlay ? `${AmountUtil.moneyConvert(amount)}` : `${AmountUtil.moneyConvert(amount)} ${TOURNAMENT_CURRENCY_SYMBOLS.TDC}`,
                        currency: CURRENCY.TDC
                    }
                case TournamentCurrencyType.DC:
                    return {
                        value: amount,
                        text: isOverlay ? `${AmountUtil.moneyConvert(amount)}` : `${AmountUtil.moneyConvert(amount)} ${TOURNAMENT_CURRENCY_SYMBOLS.DC}`,
                        currency: CURRENCY.DC
                    }
                default:
                    return
            }
        }
        else {
            return;
        }
    }
}
