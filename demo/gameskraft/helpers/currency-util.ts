import Parser from "./parser";

export default class CurrencyUtil {
    private static PRICE_SCALE: number = 100;

    public static getAmountInDecimalString(price: any): string {
        return (Parser.parseFloat(price) / this.PRICE_SCALE).toFixed(2).toString();
    }

    public static getAmountInRupeeRoundedToSingleDecimal(price: any): number {
        return Parser.parseToOneDecimal((price) / this.PRICE_SCALE);
    }

    public static getAmountInRupee(price: any): number {
        return Parser.parseToTwoDecimal((price) / this.PRICE_SCALE);
    }

    public static getPointsDeScaled(price: any): number {
        return Parser.parseToTwoDecimal((price) / this.PRICE_SCALE);
    }

    public static getAmountInPaisa(price: number): number {
        return Parser.parseToInt(price * this.PRICE_SCALE);
    }

    public static getPriceScale(): number {
        return this.PRICE_SCALE;
    }
}
