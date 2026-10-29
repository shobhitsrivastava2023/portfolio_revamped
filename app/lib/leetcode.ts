export const LEETCODE_USERNAME = "shobhitsrivastava729";
export const LEETCODE_URL = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;

type Difficulty = "Easy" | "Medium" | "Hard";

export type LeetCodeStats = {
  /** Contest rating, rounded */
  rating: number | null;
  /** e.g. 7.64 → top 7.64% of contest participants */
  topPercentage: number | null;
  contests: number;
  globalRanking: number | null;
  solved: number;
  byDifficulty: { difficulty: Difficulty; solved: number; total: number }[];
};

const QUERY = `query($u: String!) {
  matchedUser(username: $u) { submitStatsGlobal { acSubmissionNum { difficulty count } } }
  userContestRanking(username: $u) { rating attendedContestsCount topPercentage globalRanking }
  allQuestionsCount { difficulty count }
}`;

type Response = {
  data?: {
    matchedUser: { submitStatsGlobal: { acSubmissionNum: { difficulty: string; count: number }[] } } | null;
    userContestRanking: { rating: number; attendedContestsCount: number; topPercentage: number; globalRanking: number } | null;
    allQuestionsCount: { difficulty: string; count: number }[];
  };
};

/** Live LeetCode stats from its public GraphQL API, refreshed daily. Null if LeetCode is unreachable. */
export async function getLeetCodeStats(): Promise<LeetCodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", referer: LEETCODE_URL },
      body: JSON.stringify({ query: QUERY, variables: { u: LEETCODE_USERNAME } }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const { data } = (await res.json()) as Response;
    if (!data?.matchedUser) return null;

    const solvedBy = new Map(data.matchedUser.submitStatsGlobal.acSubmissionNum.map((s) => [s.difficulty, s.count]));
    const totalBy = new Map(data.allQuestionsCount.map((q) => [q.difficulty, q.count]));
    const contest = data.userContestRanking;
    return {
      rating: contest ? Math.round(contest.rating) : null,
      topPercentage: contest?.topPercentage ?? null,
      contests: contest?.attendedContestsCount ?? 0,
      globalRanking: contest?.globalRanking ?? null,
      solved: solvedBy.get("All") ?? 0,
      byDifficulty: (["Easy", "Medium", "Hard"] as const).map((d) => ({
        difficulty: d,
        solved: solvedBy.get(d) ?? 0,
        total: totalBy.get(d) ?? 0,
      })),
    };
  } catch {
    return null;
  }
}
