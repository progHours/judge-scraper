import { ProblemData } from '../interfaces';

export abstract class Scraper<TUrlParams> {
  abstract getUrlParams(url: string): TUrlParams;
  abstract fetchProblem(url: string): Promise<ProblemData>;
}

export abstract class ExtendedScraper<TData> {
  abstract fetchUserSubmissions(
    handle: string,
    contestId?: string
  ): Promise<TData>;
}
