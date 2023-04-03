export interface PaginationResult {
  totalCount: number;
  perPage: number;
  currentPage: number;
  href: string;
  links: Link[];
}

export interface PaginationQueryParams {
  limit: number;
  offset: number;
}

export type Link = {
  rel: LINK_TYPE;
  href: string;
};

export enum LINK_TYPE {
  NEXT = 'next',
  PREV = 'prev',
  LAST = 'last'
}

export interface ConstructPaginationParams {
  totalCount: number;
  limit: number;
  currentPage: number;
  href: string;
}

export interface PaginationParams {
  maxRows?: number;
  totalCountQuery?: string;
  currentPage?: number;
  top?: number;
  skip?: number;
}

/**
 * Extracts the pagination params sent in the resquest query params.
 *
 * @param {PaginationParams} [params]
 * @returns {PaginationQueryParams}
 */
export function extractPaginationParams(params: PaginationParams = {}) {
  const { skip, top } = params;

  if (top) {
    return { offset: skip || 0, limit: top };
  }

  const { maxRows = 10, currentPage = 1 } = params;
  const offset = (currentPage - 1) * maxRows;

  return { offset, limit: maxRows };
}

/**
 * Constructs the pagination metadata to be returned to request.
 *
 * The pagination result must contain the following parameters as per =convention:
 * @see https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#981-server-driven-paging
 * @example
 * {
 *    href: '/recommendation',
 *    totalCount: 20,
 *    currentPage: 2,
 *    perPage: 10,
 *    links: [
 *      { href: '/recommendation?page=1', rel: 'prev' },
 *      { href: '/recommendation?page=2', rel: 'last' }
 *     ]
 *  }
 *
 * @param {ConstructPaginationParams} params
 * @returns {PaginationResult}
 */
export function constructPaginationResult(params: ConstructPaginationParams): PaginationResult {
  const { totalCount, limit, currentPage, href } = params;
  const lastPageNumber = Math.ceil(totalCount / limit);
  let linksArray = Object.values(LINK_TYPE);

  if (currentPage === 1) {
    linksArray = linksArray.filter((data) => data !== 'prev');
  }

  if (currentPage == lastPageNumber) {
    linksArray = linksArray.filter((data) => data !== 'next');
  }

  const linkInfo: { [key: string]: Link } = {
    prev: { href: constructPageUrl(href, currentPage - 1), rel: LINK_TYPE.PREV },
    next: { href: constructPageUrl(href, currentPage + 1), rel: LINK_TYPE.NEXT },
    last: { href: constructPageUrl(href, lastPageNumber), rel: LINK_TYPE.LAST }
  };

  return {
    href,
    totalCount,
    currentPage,
    perPage: limit,
    links: linksArray.map((data) => linkInfo[data])
  };
}

/**
 * Construct Pagination url as pageNumber.
 *
 * @param {string} href
 * @param {number} pageNumber
 * @returns {string}
 */
function constructPageUrl(href: string, pageNumber: number) {
  return `${href}?page=${pageNumber}`;
}
