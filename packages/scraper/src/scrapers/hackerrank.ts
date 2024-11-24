import axios from 'axios';
import * as cheerio from 'cheerio';
import { pathToRegexp } from 'path-to-regexp';

import { Scraper } from '../base/Scraper';
import { unifyUrl } from '../utils';

const INVALID_PROBLEM_URL_ERROR = 'Invalid HackerRank problem URL';

export type HackerRankUrlParams =
  | {
      type: 'challenges_url';
      problemId: string;
    }
  | {
      type: 'contest_url';
      contestId: string;
      problemId: string;
    };

export class HackerRankScraper implements Scraper<HackerRankUrlParams> {
  static urlPatterns = [
    {
      type: 'challenges_url',
      regexp: pathToRegexp(
        'https\\://hackerrank.com/challenges/:problemId/problem'
      ),
    },
    {
      type: 'contest_url',
      regexp: pathToRegexp(
        'https\\://hackerrank.com/contests/:contestId/challenges/:problemId'
      ),
    },
  ] as const;

  formatUrl(url: string) {
    const _url = new URL(url);
    if (_url.searchParams.get('isFullScreen')) {
      _url.searchParams.delete('isFullScreen');
    }
    return _url.toString();
  }

  getUrlParams(url: string): HackerRankUrlParams {
    url = unifyUrl(url);

    // check if the given url falls into a valid URL pattern
    for (const pattern of HackerRankScraper.urlPatterns) {
      const match = pattern.regexp.exec(url);
      if (!match) continue;

      if (pattern.type === 'contest_url') {
        return {
          type: 'contest_url',
          contestId: match[1],
          problemId: match[2],
        };
      } else if (pattern.type === 'challenges_url') {
        return {
          type: 'challenges_url',
          problemId: match[1],
        };
      }
    }

    // when it doesn't match any of the given pattern
    // the link is invalid, hence throwing an error
    throw new Error(INVALID_PROBLEM_URL_ERROR);
  }

  async fetchProblem(url: string) {
    url = unifyUrl(url);

    url = this.formatUrl(url);
    const { type, problemId } = this.getUrlParams(url);

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const _ = cheerio.load(data);

    let name = '';
    const pid = `HR-${problemId}`;

    if (type === 'contest_url') {
      const _name = _('meta[property="og:title"]').attr('content');
      if (!_name) throw new Error(INVALID_PROBLEM_URL_ERROR);
      name = _name;
    } else if (type === 'challenges_url') {
      const _name = _('h1.ui-icon-label.page-label').text().trim();
      if (!_name) throw new Error(INVALID_PROBLEM_URL_ERROR);
      name = _name;
    }

    return {
      name,
      pid,
      tags: [],
      difficulty: 0,
      url,
    };
  }
}
