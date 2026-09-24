import requests


LEETCODE_URL = "https://leetcode.com/graphql"


def fetch_leetcode_stats(username):
    query = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {

    profile {
      ranking
    }

    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }

    tagProblemCounts {
      advanced {
        tagName
        problemsSolved
      }

      intermediate {
        tagName
        problemsSolved
      }

      fundamental {
        tagName
        problemsSolved
      }
    }
  }
}
"""

    variables = {
        "username": username
    }

    response = requests.post(
        LEETCODE_URL,
        json={
            "query": query,
            "variables": variables
        },
        headers={"Content-Type": "application/json"},
        timeout=15
    )
    response.raise_for_status()
    data = response.json()

    if not data.get("data", {}).get("matchedUser"):
        raise ValueError(f"LeetCode user '{username}' was not found.")

    return data

def parse_leetcode_stats(data):
    user = data.get("data", {}).get("matchedUser")
    if not user:
        raise ValueError("Invalid LeetCode data structure: matchedUser not found.")

    profile = user.get("profile") or {}
    ranking = profile.get("ranking") or 0

    stats = user.get("submitStats", {}).get("acSubmissionNum") or []
    total_solved = stats[0]["count"] if len(stats) > 0 else 0
    easy_solved = stats[1]["count"] if len(stats) > 1 else 0
    medium_solved = stats[2]["count"] if len(stats) > 2 else 0
    hard_solved = stats[3]["count"] if len(stats) > 3 else 0

    return {
        "ranking": ranking,
        "total_solved": total_solved,
        "easy_solved": easy_solved,
        "medium_solved": medium_solved,
        "hard_solved": hard_solved,
    }

def parse_topic_stats(data):
    topics = []
    user = data.get("data", {}).get("matchedUser")
    if not user:
        return topics

    counts = user.get("tagProblemCounts") or {}

    for category in counts:
        for topic in counts[category]:
            topics.append({
                "topic_name": topic.get("tagName", "Unknown"),
                "solved_count": topic.get("problemsSolved", 0),
                "category": category
            })

    return topics