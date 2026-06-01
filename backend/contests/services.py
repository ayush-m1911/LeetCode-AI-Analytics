import requests
from datetime import datetime, timezone


LEETCODE_URL = "https://leetcode.com/graphql"


def fetch_contest_history(username: str) -> list:
    """
    Fetch contest ranking history from LeetCode GraphQL API.
    Returns a list of contest dicts.
    """
    query = """
query userContestRankingInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
"""
    try:
        response = requests.post(
            LEETCODE_URL,
            json={"query": query, "variables": {"username": username}},
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        data = response.json()
        history_raw = data.get("data", {}).get("userContestRankingHistory") or []

        contests = []
        for entry in history_raw:
            if not entry.get("attended"):
                continue
            start_time = entry.get("contest", {}).get("startTime", 0)
            contests.append({
                "contest_title": entry.get("contest", {}).get("title", "Unknown"),
                "ranking": entry.get("ranking", 0),
                "rating": entry.get("rating", 0),
                "rating_change": 0,  # will be calculated below
                "problems_solved": entry.get("problemsSolved", 0),
                "total_problems": entry.get("totalProblems", 0),
                "attended_at": datetime.fromtimestamp(start_time, tz=timezone.utc) if start_time else None,
                "finish_time_in_seconds": entry.get("finishTimeInSeconds", 0),
            })

        # Calculate rating changes
        if len(contests) > 1:
            for i in range(len(contests) - 1, 0, -1):
                contests[i]["rating_change"] = round(
                    contests[i]["rating"] - contests[i - 1]["rating"], 2
                )

        return contests

    except Exception as e:
        print(f"Contest fetch error: {e}")
        return []
