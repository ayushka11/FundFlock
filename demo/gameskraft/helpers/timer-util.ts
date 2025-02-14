import Parser from "./parser";

export default class TimerUtil {
    private static TIMER_SCALE: number = 1000;

    public static getTimeInSecondsString(price: any): string {
        return (Parser.parseFloat(price) / this.TIMER_SCALE).toFixed(2).toString();
    }

    public static getTimeInSeconds(price: any): number {
        return ((price) / this.TIMER_SCALE);
    }

    public static getTimeInMilliSeconds(price: number): number {
        return (price * this.TIMER_SCALE);
    }

    public static getTimerScale(): number {
        return this.TIMER_SCALE;
    }
}
