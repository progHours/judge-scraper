import {
  CcSubmissions,
  CfSubmissions,
  CodeChefScraper,
  CodeforcesScraper,
} from '../scrapers';

const UNSUPPORTED_ONLINE_JUDGE_ERROR = 'Unsupported Online Judge';

export type BaseSubmissionsOptions = {
  handle: string;
  contestId?: string;
};

export type JudgeOptions = {
  CODEFORCES: BaseSubmissionsOptions;
  CODECHEF: BaseSubmissionsOptions & {
    clientId: string;
    secret: string;
  };
};

export type JudgeSubmissions = {
  CODEFORCES: CfSubmissions;
  CODECHEF: CcSubmissions;
};

export async function fetchUserSubmissions<T extends keyof JudgeOptions>(
  judge: T,
  options: JudgeOptions[T]
): Promise<JudgeSubmissions[T]> {
  const { handle, contestId } = options;
  switch (judge) {
    case 'CODEFORCES': {
      const crawler = new CodeforcesScraper();
      const data = await crawler.fetchUserSubmissions(handle, contestId);
      return data as JudgeSubmissions[T];
    }
    case 'CODECHEF': {
      const crawler = new CodeChefScraper();
      crawler.setApiKey({
        clientId: (options as JudgeOptions['CODECHEF']).clientId,
        secret: (options as JudgeOptions['CODECHEF']).secret,
      });
      const data = await crawler.fetchUserSubmissions(handle, contestId);
      return data as JudgeSubmissions[T];
    }
    default:
      throw new Error(UNSUPPORTED_ONLINE_JUDGE_ERROR);
  }
}
