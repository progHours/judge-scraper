import axios from 'axios';
import * as cheerio from 'cheerio';
import { pathToRegexp } from 'path-to-regexp';

import { Scraper } from '../base/Scraper';
import { unifyUrl } from '../utils';

const INVALID_PROBLEM_URL_ERROR = 'Invalid Eolymp problem URL';

export type EolympUrlParams = {
  type: 'problemset_url';
  problemId: string;
};

export class EolympScraper implements Scraper<EolympUrlParams> {
  static urlPatterns = [
    {
      type: 'problemset_url',
      regexp: pathToRegexp('https\\://eolymp.com/en/problems/:problemId'),
    },
  ] as const;

  getUrlParams(url: string): EolympUrlParams {
    url = unifyUrl(url);

    // check if the given url falls into a valid URL pattern
    for (const pattern of EolympScraper.urlPatterns) {
      const match = pattern.regexp.exec(url);
      if (!match) continue;
      return {
        type: 'problemset_url',
        problemId: match[1],
      };
    }

    // when it doesn't match any of the given pattern
    // the link is invalid, hence throwing an error
    throw new Error(INVALID_PROBLEM_URL_ERROR);
  }

  async fetchProblem(url: string) {
    url = unifyUrl(url);

    const { problemId } = this.getUrlParams(url);

    const { data } = await axios.get(url);
    const _ = cheerio.load(data);

    const name = _('h1.MuiTypography-h1 span.ecm-span').text().trim();

    return {
      pid: `Eolymp-${problemId}`,
      name,
      difficulty: 0,
      url,
      tags: [],
    };
  }
}
