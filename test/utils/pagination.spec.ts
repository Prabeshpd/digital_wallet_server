import 'mocha';
import { expect } from 'chai';

import { extractPaginationParams, constructPaginationResult } from '../../src/utils/pagination';

describe('Pagination', () => {
  describe('extractPageParameters()', () => {
    it('should return pagination parameters passed as query Params', () => {
      const params = extractPaginationParams({ currentPage: 1, maxRows: 10 });
      expect(params).to.have.all.keys('limit', 'offset');
      expect(params).to.deep.equal({ limit: 10, offset: 0 });
    });

    it('should return the pagination parameters as passed by client for offset and limit', () => {
      const params = extractPaginationParams({ top: 20, skip: 40 });
      expect(params).to.have.all.keys('limit', 'offset');
      expect(params).to.deep.equal({ limit: 20, offset: 40 });
    });

    it('should return default parameter values if nothing is passed in query', () => {
      const params = extractPaginationParams();

      expect(params).to.have.all.keys('limit', 'offset');
      expect(params).to.deep.equal({ limit: 10, offset: 0 });
    });
  });

  describe('constructPaginationResult()', () => {
    it('should return pagination result in the specified format', () => {
      const paginationResult = constructPaginationResult({
        totalCount: 20,
        limit: 10,
        currentPage: 2,
        href: '/recommendation'
      });

      expect(paginationResult).to.have.all.keys('href', 'totalCount', 'currentPage', 'perPage', 'links');
      expect(paginationResult).to.deep.equal({
        href: '/recommendation',
        totalCount: 20,
        currentPage: 2,
        perPage: 10,
        links: [
          { href: '/recommendation?page=1', rel: 'prev' },
          { href: '/recommendation?page=2', rel: 'last' }
        ]
      });
    });
  });
});
