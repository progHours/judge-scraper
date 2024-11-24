import { AtCoderScraper } from '../scrapers';
import { ProblemData } from '../interfaces';

describe('AtCoder scraper', () => {
  let scraper: AtCoderScraper;

  beforeEach(() => {
    scraper = new AtCoderScraper();
  });

  it('should parse atcoder problem - abc322_e', async () => {
    const result = await scraper.fetchProblem(
      'https://atcoder.jp/contests/abc322/tasks/abc322_e'
    );
    const expectedResult: ProblemData = {
      name: 'Product Development',
      pid: 'AC-abc322_e',
      tags: [],
      difficulty: 0,
      url: 'https://atcoder.jp/contests/abc322/tasks/abc322_e',
    };
    expect(result).toEqual(expectedResult);
  });

  it('should parse atcoder problem - abc322_e (with www)', async () => {
    const result = await scraper.fetchProblem(
      'https://www.atcoder.jp/contests/abc322/tasks/abc322_e'
    );
    const expectedResult: ProblemData = {
      name: 'Product Development',
      pid: 'AC-abc322_e',
      tags: [],
      difficulty: 0,
      url: 'https://atcoder.jp/contests/abc322/tasks/abc322_e',
    };
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error with invalid problem id', async () => {
    try {
      await scraper.fetchProblem(
        'https://atcoder.jp/contests/abc322/tasks/abc322_k'
      );
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
