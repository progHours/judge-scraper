import { UvaScraper } from '../scrapers';
import { ProblemData } from '../interfaces';

describe('UVa crawler', () => {
  let crawler: UvaScraper;

  beforeEach(() => {
    crawler = new UvaScraper();
  });

  it('should parse UVa problem - 408', async () => {
    const result = await crawler.fetchProblem(
      'https://onlinejudge.org/index.php?option=onlinejudge&Itemid=8&page=show_problem&problem=349'
    );
    const expectedResult: ProblemData = {
      pid: 'UVA-408',
      name: 'Uniform Generator',
      tags: [],
      difficulty: 0,
      url: 'https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=349',
    };
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error with invalid problem id', async () => {
    try {
      await crawler.fetchProblem(
        'https://onlinejudge.org/index.php?option=onlinejudge&Itemid=8&page=show_problem&problem=34922'
      );
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
