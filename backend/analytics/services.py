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
        }
    )

    return response.json()

def parse_leetcode_stats(data):

    user = data["data"]["matchedUser"]

    ranking = user["profile"]["ranking"]

    stats = user["submitStats"]["acSubmissionNum"]

    return {
        "ranking": ranking,
        "total_solved": stats[0]["count"],
        "easy_solved": stats[1]["count"],
        "medium_solved": stats[2]["count"],
        "hard_solved": stats[3]["count"],
    }

def parse_topic_stats(data):

    topics = []

    counts = data["data"]["matchedUser"]["tagProblemCounts"]

    for category in counts:

        for topic in counts[category]:

            topics.append({
                "topic_name": topic["tagName"],
                "solved_count": topic["problemsSolved"],
                "category": category
            })

    return topics