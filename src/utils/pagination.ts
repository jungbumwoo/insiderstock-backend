export const paginate = (
    totalItems: number,
    currentPage: number = 1,
    pageSize: number = 10,
    maxPages: number = 10
) => {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    //ensure current page isn't out of range
    if (currentPage <1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if(totalPages <= maxPages) {
         // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
     } else {
        // total pages more than max so calculate start and pages
        let maxPageBeforeCurrentPage = Math.ceil(maxPages /2) -1;
        let maxPageAfterCurrentPage = Math.floor(maxPages /2);
        if (currentPage <= maxPageBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPages;
        } else if (maxPageAfterCurrentPage + currentPage >= maxPages) {
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPageBeforeCurrentPage;
            endPage = currentPage + maxPageAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage -1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize -1, totalItems -1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage +1) - startPage).keys()).map(i => startPage + 1);
    console.log("pages at pagination");
    console.log(pages);

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
    }
};
// export = paginate;

//
export const pagedArray = (elements, query) => {
    // elements
    const items = [...elements.keys()].map(i => ({ id: (i +1), name: 'Item' + ( i + 1) }));

    // get page from query or default to first page
    const page = parseInt(query) || 1;
    
    // get pager object for specified pages
    const pageSize = 5;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return { pager, pageOfItems};
}