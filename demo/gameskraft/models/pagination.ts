import {PAGINATION} from "../constants/constants";

export default class Pagination {
  offset: number;
  numOfRecords: number;
  pageNo?: number;

  constructor(offset: number, numOfRecords: number, pageNo: number) {
    this.offset = offset;
    this.numOfRecords = numOfRecords;
    this.pageNo = pageNo;

  }

  public static get(offset: number, numOfRecords: number, pageNo?: number): Pagination {
    const pagination: Pagination = new Pagination(
      PAGINATION.DEFAULT_OFFSET,
      PAGINATION.DEFAULT_NUM_OF_RECORDS,
      PAGINATION.DEFAULT_PAGE_NO
    );
    if (offset) {
      pagination.offset = offset;
    }
    if (numOfRecords) {
      pagination.numOfRecords =
        numOfRecords > PAGINATION.MAX_NUM_OF_RECORDS
          ? PAGINATION.MAX_NUM_OF_RECORDS
          : numOfRecords;
    }
    if(pageNo) {
      pagination.pageNo = pageNo
    }
    return pagination;
  }

  public static getDefault(): Pagination {
    const pagination: Pagination = new Pagination(
      PAGINATION.DEFAULT_OFFSET,
      PAGINATION.DEFAULT_NUM_OF_RECORDS,
      PAGINATION.DEFAULT_PAGE_NO
    );
    return pagination;
  }

  public static getDefaultCategoriesPagination(): Pagination {
    const pagination: Pagination = new Pagination(
      PAGINATION.DEFAULT_OFFSET,
      PAGINATION.MAX_NUM_OF_RECORDS_30,
      PAGINATION.DEFAULT_PAGE_NO
    );
    return pagination;
  }

  public static getEventPagination(): Pagination {
    return new Pagination(
      PAGINATION.DEFAULT_OFFSET,
      PAGINATION.MAX_EVENTS_RECORDS,
      PAGINATION.DEFAULT_PAGE_NO
    );
  }
}
