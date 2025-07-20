const { URL } = require('url');

// generate pagination links
const generatePaginationLinks = (originalUrl, currentPage, totalPages, limit) => {
    const generatePaginationUrl = (pageNum) => {
        const url = new URL(originalUrl, "http://temp.com"); 
        url.searchParams.set('page', pageNum);
        url.searchParams.set('limit', limit);
        return url.toString().replace("http://temp.com", '');

    };

    const links = {};

    links.first = generatePaginationUrl(1);
    links.last = generatePaginationUrl(totalPages);

    if (currentPage > 1) {
        links.previous = generatePaginationUrl(currentPage - 1);
    }

    if (currentPage < totalPages) {
        links.next = generatePaginationUrl(currentPage + 1);
    }

    return links;
};

module.exports = { generatePaginationLinks };
