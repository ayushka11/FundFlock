import {addDays, differenceInDays, endOfDay, format, startOfDay, subDays, subHours, subMinutes, subMonths} from 'date-fns';
import { FISCAL_YEAR_CONFIG } from '../constants/constants';
import Parser from './parser';
import moment from 'moment';

const { utcToZonedTime } = require('date-fns-tz');

export default class DatetimeUtil {

	private static timezone = 'Asia/Kolkata';
	private static utcTimezone = 'UTC';

	static getTimeMomentsAgo = (timestamp: string) => {
		if(!timestamp)	return ''
		const date = new Date(timestamp);
		return moment(date).fromNow();
	}

	static getTimeFromString(startTime: string) {
		const d = new Date(startTime);
		return d.getTime();
	}

	private static months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	static getDateISO(epoch: string): string {
		return new Date(Parser.parseNumber(epoch)).toISOString();
	}

	static getDateEpoch(isoString: string): number {
		return new Date(isoString).getTime();
	}

	/*
	*	Returns formatted datetime in format: 05 May, 8:39pm
	*/
	static getFormattedTime = (timestamp: number) => {
		if(!timestamp || timestamp <= 0 || typeof timestamp === 'string') {
			return '';
		}

		const curTime = utcToZonedTime(new Date(Date.now()), DatetimeUtil.timezone);
		const dateTime = utcToZonedTime(new Date(timestamp), DatetimeUtil.timezone);
		const date = dateTime.getDate();
		const monthName = DatetimeUtil.months[dateTime.getMonth()];
		const year = dateTime.getFullYear();
		let hours = dateTime.getHours();
		const ampm = hours >= 12 ? 'pm' : 'am';
		let minutes = dateTime.getMinutes();
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const strDate = date < 10 ? ('0' + date) : date;
		const strMinutes = minutes < 10 ? ('0' + minutes) : minutes;
		const time = hours + ':' + strMinutes + '' + ampm;

		if(year < curTime.getFullYear() || year > curTime.getFullYear()) {
			return strDate + ' ' + monthName + ' ' + year + ', ' + time;
		} else {
			return strDate + ' ' + monthName + ', ' + time;
		}
	}

	/*
	*	Returns formatted datetime in format given in the parameter: 05 May 2022 for locale "en-US" and format { year: 'numeric', month: 'long', day: 'numeric' }
	*/
	static getFormattedDateString(epoch: number, locale: string, format: any): string {
		return new Date(epoch).toLocaleDateString(locale, format);
	}

	static getFormattedDate(date: Date, formatString: string): string {
		return format(date, formatString);
	}

	static getTimeZoneDate(date: Date): Date {
		return utcToZonedTime(date, DatetimeUtil.timezone);
	}

	static getUTCDate(date: Date): Date {
		return utcToZonedTime(date, DatetimeUtil.utcTimezone);
	}

	static getEndOfDayDate(date: Date): Date {
		return endOfDay(date);
	}

	static subtractDays(date: Date, days: number): Date {
		return subDays(date, days);
	}

	static subtractMonths(date: Date, month: number): Date {
		return subMonths(date, month)
	}

	static addDays(date: Date, days: number): Date {
		return addDays(date, days);
	}

	static getStartAndEndOfDayInUTC(date) {
	  const currentDateTimeIST = utcToZonedTime(date, DatetimeUtil.timezone);
	  const start = subHours(subMinutes(startOfDay(currentDateTimeIST), 30), 5);
	  const end = subHours(subMinutes(endOfDay(currentDateTimeIST), 30), 5);
	  const dateFormat = 'yyyy-MM-dd HH:mm:ss';
	  return {
		startOfDay: format(start, dateFormat),
		endOfDay: format(end, dateFormat)
	  };
	}

	static getStartOfFiscalYear(): Date {
			const date = new Date();
			return new Date(date.getFullYear() - 1, FISCAL_YEAR_CONFIG.MONTH, FISCAL_YEAR_CONFIG.DAY)
	}


	static getCashbackExpiryText(timestamp: number) {
		if (timestamp > Date.now()) {
			const days = differenceInDays(timestamp, Date.now());
			if (days === 0) {
				return `Expires Soon`;
			}
			return `Expires in ${days} Days`;
		} else {
			return `Expired`;
		}
	}

	static getTzTime(timestamp: string) {
		const dateObject = new Date(timestamp);
		const formattedDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss'Z'");
		return formattedDate;
	}

	static getPslFormattedDate(timestamp: number) {
		const date = new Date(timestamp);
		const istDate = utcToZonedTime(date, DatetimeUtil.timezone);
		return format(istDate, "do MMM");
	}
}
