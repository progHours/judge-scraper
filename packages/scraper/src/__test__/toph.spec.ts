import { TophScraper } from '../scrapers';
import { ProblemData } from '../interfaces';

describe('Toph crawler', () => {
  let crawler: TophScraper;

  beforeEach(() => {
    crawler = new TophScraper();
  });

  it('should parse toph problem - cash-change', async () => {
    const result = await crawler.fetchProblem('https://toph.co/p/cash-change');
    const expectedResult: ProblemData = {
      pid: 'Toph-cash-change',
      name: 'Cash Change',
      difficulty: 0,
      tags: ['greedy', 'implementation'],
      url: 'https://toph.co/p/cash-change',
    };
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error with invalid problem id', async () => {
    try {
      await crawler.fetchProblem('https://toph.co/p/cashing-changing');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
