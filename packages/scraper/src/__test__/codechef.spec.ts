import { CodeChefScraper } from '../scrapers';
import { ProblemData } from '../interfaces';

describe('CodeChef scraper', () => {
  let scraper: CodeChefScraper;

  beforeEach(() => {
    scraper = new CodeChefScraper();
  });

  it('should parse codechef problem - PREFONES (problemset link)', async () => {
    const result = await scraper.fetchProblem(
      'https://www.codechef.com/problems/PREFONES'
    );
    const expectedResult: ProblemData = {
      pid: 'CC-PREFONES',
      name: 'Prefix Ones',
      difficulty: 1455,
      tags: ['greedy'],
      url: 'https://www.codechef.com/problems/PREFONES',
    };
    expect(result).toEqual(expectedResult);
  });
});
