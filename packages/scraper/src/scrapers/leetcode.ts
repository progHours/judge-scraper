import axios from 'axios';
import { pathToRegexp } from 'path-to-regexp';

import { Scraper } from '../base/Scraper';
import { unifyUrl } from '../utils';

const INVALID_PROBLEM_URL_ERROR = 'Invalid LeetCode problem URL';

export type LeetCodeUrlParams = {
  type: 'problemset_url';
  problemId: string;
};

export class LeetCodeScraper implements Scraper<LeetCodeUrlParams> {
  static urlPatterns = [
    {
      type: 'problemset_url',
      regexp: pathToRegexp('https\\://leetcode.com/problems/:problemId'),
    },
  ] as const;

  getUrlParams(url: string): LeetCodeUrlParams {
    url = unifyUrl(url);

    // check if the given url falls into a valid URL pattern
    for (const pattern of LeetCodeScraper.urlPatterns) {
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
    const { data } = await axios.post('https://leetcode.com/graphql', {
      operationName: 'questionData',
      variables: { titleSlug: problemId },
      query:
        'query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId, title, titleSlug }}',
    });

    if (!data.data.question) {
      throw new Error(INVALID_PROBLEM_URL_ERROR);
    }

    const { data: tagsData } = await axios.post(
      'https://leetcode.com/graphql',
      {
        operationName: 'singleQuestionTopicTags',
        variables: { titleSlug: problemId },
        query:
          'query singleQuestionTopicTags($titleSlug: String!) { question(titleSlug: $titleSlug) { topicTags { name, slug } } }',
      }
    );

    const tags = tagsData.data.question.topicTags.map(
      (topicTags: { name: string }) => {
        return topicTags.name.toLowerCase();
      }
    );

    const { questionId, title: name } = data.data.question;

    return {
      pid: `LC-${questionId}`,
      name,
      difficulty: 0,
      url,
      tags,
    };
  }
}
