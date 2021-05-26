"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.pagedArray = exports.paginate = void 0;
var paginate = function (totalItems, currentPage, pageSize, maxPages) {
    if (currentPage === void 0) { currentPage = 1; }
    if (pageSize === void 0) { pageSize = 10; }
    if (maxPages === void 0) { maxPages = 10; }
    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);
    //ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    }
    else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    var startPage, endPage;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    }
    else {
        // total pages more than max so calculate start and pages
        var maxPageBeforeCurrentPage = Math.ceil(maxPages / 2) - 1;
        var maxPageAfterCurrentPage = Math.floor(maxPages / 2);
        if (currentPage <= maxPageBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPages;
        }
        else if (maxPageAfterCurrentPage + currentPage >= maxPages) {
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        }
        else {
            startPage = currentPage - maxPageBeforeCurrentPage;
            endPage = currentPage + maxPageAfterCurrentPage;
        }
    }
    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    var pages = Array.from(Array((endPage + 1) - startPage).keys()).map(function (i) { return startPage + 1; });
    console.log("pages at pagination");
    console.log(pages);
    // return object with all pager properties  required by the view.
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
};
exports.paginate = paginate;
// export = paginate;
//
var pagedArray = function (elements, query) {
    // elements
    var items = __spreadArray([], elements.keys()).map(function (i) { return ({ id: (i + 1), name: 'Item' + (i + 1) }); });
    // get page from query or default to first page
    var page = parseInt(query) || 1;
    // get pager object for specified pages
    var pageSize = 5;
    var pager = exports.paginate(items.length, page, pageSize);
    // get page of items from items array
    var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    // return pager object and current page of items
    return { pager: pager, pageOfItems: pageOfItems };
};
exports.pagedArray = pagedArray;
