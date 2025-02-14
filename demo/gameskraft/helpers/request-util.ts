import Pagination from '../models/pagination';
import {REQUEST_PARAMS} from "../constants/constants";
import QueryParam from "../models/query-param";

export default class RequestUtil {
  public static parseQueryParamAsNumber(
      parameters: any,
      parameterName: string,
  ): number {
    return Number.parseInt(parameters[parameterName] || '0', 10);
  }

  public static parseQueryParamAsNumberWithTwoDecimal(
    parameters: any,
    parameterName: string,
  ): number {
    return Number.parseFloat(parameters[parameterName] || '0');
  }
  public static parseQueryParamAsString(
      parameters: any,
      parameterName: string,
  ): string {
    return parameters[parameterName] || '';
  }

  public static parseQueryParamAsArray(
      parameters: any,
      parameterName: string,
  ): string[] {
    return (
        (parameters[parameterName] && parameters[parameterName].split(',')) || []
    );
  }

  // Filter only number parse values
  public static parseQueryParamAsNumberArray(
      parameters: any,
      parameterName: string,
  ): number[] {
    return (
        (parameters[parameterName] && parameters[parameterName].split(',')) ||
        []
    ).map((element: string) => Number.parseInt(element || '0', 10));
  }

  public static parseQueryParamAsObjectArray<T>(parameters: any, parameterName: string): T[] {
    const rawList = parameters[parameterName];

    if (rawList) {
        try {
            const parsedList = JSON.parse(decodeURIComponent(rawList));
            if (Array.isArray(parsedList)) {
                return parsedList.map((item: any) => {
                    const parsedObject = item as T;
                    return parsedObject;
                });
            }
        } catch (error) {
            console.error(`Error parsing ${parameterName}:`, error);
        }
    }

    return [];
  }


  // public static getRequestIdFromHeader(headers: any): string {
  //   return (
  //       headers[Constants.REQUEST_HEADERS.REQUEST_ID] ||
  //       headers[Constants.REQUEST_HEADERS.REQUEST_ID.toUpperCase()] ||
  //       ''
  //   );
  // }

  public static parseQueryAsDate(
    parameters: any,
    parameterName: string,
  ): Date | void {
    if (parameters[parameterName]) {
      return new Date(parameters[parameterName]);
    }
  }

  public static parseQueryParamAsBoolean(
		parameters: any,
		parameterName: string,
	): boolean {
		return parameters[parameterName] || false;
	}

  public static getPaginationInfo(query: any): Pagination {

    const pageNo: number = RequestUtil.parseQueryParamAsNumber(
      query,
      REQUEST_PARAMS.PAGE_NO,
    );

    const offset: number = RequestUtil.parseQueryParamAsNumber(
        query,
        REQUEST_PARAMS.OFFSET_QUERY_STRING,
    );
    const numOfRecords: number = RequestUtil.parseQueryParamAsNumber(
        query,
        REQUEST_PARAMS.NUM_OF_RECORDS_QUERY_STRING,
    );

    return Pagination.get(offset, numOfRecords, pageNo);
  }

  public static createQueryParamString(...args : QueryParam[]): string {
    const filters: string[] = []
    args.forEach(arg => {
      filters.push(`${arg.param}=${arg.value}`)
    })

    return filters.join("&")
  }

  public static getCompleteRequestURL(baseUrl: string, relativePath: string, queryParams? : QueryParam[]): string {
    return `${baseUrl}${relativePath}/${queryParams && queryParams.length > 0 && ("?" + RequestUtil.createQueryParamString(...queryParams)) || ""}`;
  }
}
