import {
  AtCoderScraper,
  CodeChefScraper,
  CodeforcesScraper,
  CsesScraper,
  EolympScraper,
  HackerRankScraper,
  KattisScraper,
  LeetCodeScraper,
  LightOjScraper,
  SpojScraper,
  TimusScraper,
  TophScraper,
  UvaScraper,
} from '../scrapers';
import { ProblemData } from '../interfaces';

const UNSUPPORTED_ONLINE_JUDGE_ERROR = 'Unsupported Online Judge';

export function fetchProblemData(url: string): Promise<ProblemData> {
  const { hostname } = new URL(url);

  type ScraperDomain = keyof typeof scraperFactory;

  const scraperFactory = {
    'codeforces.com': () => new CodeforcesScraper(),
    'codechef.com': () => new CodeChefScraper(),
    'cses.fi': () => new CsesScraper(),
    'toph.co': () => new TophScraper(),
    'spoj.com': () => new SpojScraper(),
    'onlinejudge.org': () => new UvaScraper(),
    'atcoder.jp': () => new AtCoderScraper(),
    'lightoj.com': () => new LightOjScraper(),
    'hackerrank.com': () => new HackerRankScraper(),
    'timus.ru': () => new TimusScraper(),
    'leetcode.com': () => new LeetCodeScraper(),
    'open.kattis.com': () => new KattisScraper(),
    'eolymp.com': () => new EolympScraper(),
  } as const;

  // Find the matching domain by checking if hostname ends with any of the supported domains
  const matchingDomain = Object.keys(scraperFactory).find((domain) =>
    hostname.endsWith(domain)
  ) as ScraperDomain | undefined;

  if (!matchingDomain) {
    throw new Error(UNSUPPORTED_ONLINE_JUDGE_ERROR);
  }

  const scraper = scraperFactory[matchingDomain]();
  return scraper.fetchProblem(url);
}
