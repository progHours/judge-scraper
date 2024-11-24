## online-judge-scraper

`online-judge-scraper` is a library designed to extract information from various online judges. It provides:

- Problem Information: Fetches problem details like `name`, `problem_id`, `contest_id`, `tags`, `difficulty` etc.
- Submission Information: Retrieves user submission data from supported platforms
- User Information: (WIP) Will provide user profile and statistics
- Contest Information: (WIP) Will provide contest details and standings

In cases where an API is not available, `online-judge-scraper` utilizes web crawling techniques to gather the necessary data.

### Installation

The library is available online and can be installed via npm

```bash
npm i online-judge-scraper
```

### Basic Usage

#### Fetch information about a problem

```js
import { fetchProblem } from 'online-judge-scraper';

async function main() {
  const data = await fetchProblem('https://codeforces.com/problemset/problem/1879/D');

  // do something with the data
  console.log(data);
}

main();
```

If you are using CommonJS modules, you can also use the `require` function to import the library. The returned object from `fetchProblem` will satisfy the following interface.

```ts
interface ProblemData {
  pid: string;
  name: string;
  url: string;
  tags: string[];
  difficulty: number;
}
```

#### Fetch Submissions of an User

```js
import { fetchUserSubmissions } from 'online-judge-scraper';

async function main() {
  const data = await fetchUserSubmissions('CODEFORCES', {
    handle: 'naimul_haque',
  });

  // data is of type CfSubmissions
  // do something with the data
  console.log(data.totalSolved);
  console.log(data.submissions);
}

main();
```

In order to fetch submissions from CodeChef, we need to pass in the 2 extra properties `clientId` and `secret`, so that our scraper can talk with the CodeChef APIs.

```js
import { fetchUserSubmissions } from 'online-judge-scraper';

async function main() {
  const data = await fetchUserSubmissions('CODECHEF', {
    handle: 'naimul_haque',
    clientID: 'CODECHEF_API_CLIENT_ID',
    secret: 'CODECHEF_API_SECRET',
  });

  // data is of type CcSubmissions
  // do something with the data
  console.log(data.totalSolved);
  console.log(data.submissions);
}

main();
```

Additionally, you can also pass an optional `contestId` to fetch user submissions from only that contestId. This works simillarly for CodeChef as well.

```js
import { fetchUserSubmissions } from 'online-judge-scraper';

async function main() {
  const data = await fetchUserSubmissions('CODEFORCES', {
    handle: 'naimul_haque',
    contestId: '1742',
  });

  // data is of type CfSubmissions
  // do something with the data
  console.log(data.totalSolved);
  console.log(data.submissions);
}

main();
```

Currently, `fetchUserSubmissions` only supports Codeforces and CodeChef. The returned object from `fetchUserSubmissions` will return one of the following interfaces. TypeScript will map the proper return type, based on the first parameter.

```ts
type CfSubmissions = {
  totalSolved: number;
  submissions: Array<{
    id: number;
    pid: string;
    name: string;
    url: string;
    difficulty: number;
    tags: string[];
    contestId: number;
    createdAt: Date;
    verdict: Verdict;
  }>;
};

type CcSubmissions = {
  totalSolved: number;
  submissions: Array<{
    id: number;
    pid: string;
    url: string;
    contestId: string;
    createdAt: Date;
    verdict: Verdict;
    solvedDuringContest: boolean;
  }>;
};
```

### Online Judge Support

The library currently supports 13 online judges.

1. [Codeforces](https://codeforces.com)
2. [CodeChef](https://www.codechef.com)
3. [CSES](https://cses.fi)
4. [Online Judge](https://onlinejudge.org)
5. [Toph](https://toph.co)
6. [SPOJ](https://www.spoj.com)
7. [HackerRank](https://www.hackerrank.com)
8. [LightOJ](http://lightoj.com)
9. [AtCoder](https://atcoder.jp)
10. [EOlymp](https://www.eolymp.com)
11. [LeetCode](https://leetcode.com)
12. [Timus Online Judge](http://acm.timus.ru)
13. [Kattis](https://open.kattis.com)

### Test Coverage

Each online judge is covered by individual test files. The tests could break if the 3rd party APIs or web pages changes. For example, the `codeforces.spec.ts` file contains test cases specifically designed for the Codeforces scraper. Similarly, we have `.spec.ts` files for all other online judges.

#### Running All Tests

To run all the tests project, you can execute the following command:

```bash
nx run scraper:test
```

#### Running Individual Test Files

If you wish to run tests for a specific online judge, you can use the following command:

```bash
nx run scraper:test --testFile=packages/scraper/src/__test__/codeforces.spec.ts
```
