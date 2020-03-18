import { Injectable } from '@angular/core';

export class PagingInfo {
  currentPage: number;
  pageSize: number;
  complete?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  paginate(value: Array<any>, pageInfo: PagingInfo): any {
    if (!pageInfo ||
      pageInfo.currentPage === undefined ||
      pageInfo.pageSize === undefined ||
      pageInfo.pageSize <= 0 ||
      pageInfo.currentPage < 0) {

      return value;
    }
    let res = [...value.slice(pageInfo.currentPage * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize + pageInfo.pageSize)];
    if (!pageInfo.complete) { return res; }
    if (pageInfo.currentPage === 0) { return res; }
    if (res.length === pageInfo.pageSize) { return res; }
    const index = Math.max(0, pageInfo.currentPage * pageInfo.pageSize - pageInfo.pageSize + res.length);
    res = value.slice(index, index + pageInfo.pageSize - res.length).concat(res);
    return res;
  }
}
