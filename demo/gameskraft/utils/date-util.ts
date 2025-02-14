import { addDays, addHours, addMonths, format, getDate, getDay, getYear, parseISO, startOfDay, isEqual, isBefore } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import LoggerUtil from '../utils/logger';
const logger = LoggerUtil.get("DateUtil");


export class DateUtil {
    public static isWithinNextHourFromNow = (date: number) => {
        const hour = 1000 * 60 * 60;
        const currentTime = new Date().getTime();
        const diffInTime = date - currentTime
        return diffInTime >= 0 && diffInTime < hour;
    }

    public static isSameDayToday = (date: number) => {
        const currentDate = new Date().getDate()
        const tourneyDate = new Date(date).getDate()

        const currentMonth = new Date().getMonth();
        const tourneyMonth = new Date(date).getMonth();

        const currentYear = new Date().getFullYear();
        const tourneyYear = new Date(date).getFullYear();

        return (currentDate === tourneyDate) && (currentMonth === tourneyMonth) && (currentYear === tourneyYear); // checking the day is equal to the tournament date
    }

    static convertUTCtoIST(utcDateString: string) {
        // TOCHECK Check the formate string before using, it will be used very specifically
        const utcDate = new Date(utcDateString);
        const istDate = utcToZonedTime(utcDate, 'Asia/Kolkata');
        const formattedDate = formatInTimeZone(istDate, 'Asia/Kolkata', 'yyyy-MM-dd\'T\'HH:mm:ss.SSS')
        return formattedDate;
    };

    static isInputDateTodayInIST(dateString: string): boolean {
        // Define the IST time zone
        const timeZone = 'Asia/Kolkata';
        // Parse the input date string to a Date object
        const inputDate = parseISO(dateString);

        inputDate.setHours(inputDate.getHours()-5);
        inputDate.setMinutes(inputDate.getMinutes()-30);

        // Convert the input date to IST
        const inputDateInIST = utcToZonedTime(inputDate, timeZone);
        // Get the current date in IST
        const currentDate = new Date();
        const currentDateInIST = utcToZonedTime(currentDate, timeZone);

        // Normalize both dates to the start of the day in IST for comparison
        const inputDateStartOfDay = startOfDay(inputDateInIST);
        const currentDateStartOfDay = startOfDay(currentDateInIST);

        // Compare the two dates
        return isEqual(inputDateStartOfDay, currentDateStartOfDay);
    }

    static isInputDateBeforeTodayInIST(dateString: string): boolean {
        // Define the IST time zone
        const timeZone = 'Asia/Kolkata';
        // Parse the input date string to a Date object
        const inputDate = parseISO(dateString);

        inputDate.setHours(inputDate.getHours()-5);
        inputDate.setMinutes(inputDate.getMinutes()-30);

        // Convert the input date to IST
        const inputDateInIST = utcToZonedTime(inputDate, timeZone);
        // Get the current date in IST
        const currentDate = new Date();
        const currentDateInIST = utcToZonedTime(currentDate, timeZone);

        // Normalize both dates to the start of the day in IST for comparison
        const inputDateStartOfDay = startOfDay(inputDateInIST);
        const currentDateStartOfDay = startOfDay(currentDateInIST);

        const isInputDateBeforeCurrentDate = isBefore(inputDateStartOfDay, currentDateStartOfDay)

        logger.info({inputDateStartOfDay, currentDateStartOfDay, currentDateInIST, inputDateInIST, dateString, isInputDateBeforeCurrentDate, inputDate},'isInputDateBeforeTodayInIST')

        // Compare the two dates
        return isInputDateBeforeCurrentDate;
    }
}