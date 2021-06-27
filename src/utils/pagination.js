"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagedArray = exports.paginate = void 0;
const paginate = (totalItems, currentPage = 1, pageSize = 10, maxPages = 10) => {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    //ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    }
    else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    let startPage, endPage;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    }
    else {
        // total pages more than max so calculate start and pages
        let maxPageBeforeCurrentPage = Math.ceil(maxPages / 2) - 1; //4-(1)  5-(2) 6-(2) 7(3) 8(3) 9(4) 10(4)
        let maxPageAfterCurrentPage = Math.floor(maxPages / 2); // 4-(2)  5(2)    6(3)   7(3) 8(4) 9(4) 10(5)
        if (currentPage <= maxPageBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPages;
        }
        else if (maxPageAfterCurrentPage + currentPage >= totalPages) {
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        }
        else {
            startPage = currentPage - maxPageBeforeCurrentPage;
            endPage = currentPage + maxPageAfterCurrentPage;
        }
    }
    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    // return object with all pager properties  required by the view.
    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        startPage,
        endPage,
        startIndex,
        endIndex,
        pages
    };
};
exports.paginate = paginate;
// export = paginate;
const pagedArray = (elements, query) => {
    // elements
    // const items = [...Array(elements.length).keys()].map(i => ({ id: (i +1), name: 'Item' + ( i + 1) }));
    const items = elements;
    // get page from query or default to first page
    const page = parseInt(query) || 1;
    // get pager object for specified pages
    const pageSize = 10;
    const max = 5;
    const pager = exports.paginate(items.length, page, pageSize, max);
    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    // return pager object and current page of items
    return { pager, pageOfItems };
};
exports.pagedArray = pagedArray;
//# sourceMappingURL=pagination.js.map