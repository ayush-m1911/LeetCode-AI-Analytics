import os
import json
import re
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

PROMPT_TEMPLATE = """You are an expert LeetCode coach. Generate exactly 9 problem recommendations (3 Easy, 3 Medium, 3 Hard) based on the user's profile.

User Profile:
- Global Ranking: {ranking}
- Total Solved: {total_solved} (Easy: {easy}, Medium: {medium}, Hard: {hard})
- Weak Topics (prioritize these): {weak_topics}
- Strong Topics (avoid unless necessary): {strong_topics}

CRITICAL RULES:
1. Use ONLY real LeetCode problem slugs that actually exist on leetcode.com
2. The leetcode_url MUST follow this exact format: https://leetcode.com/problems/SLUG/
3. Use well-known, popular problems with verified slugs like:
   - two-sum, add-two-numbers, longest-substring-without-repeating-characters,
   - binary-search, maximum-subarray, climbing-stairs, valid-parentheses,
   - merge-intervals, word-search, number-of-islands, course-schedule,
   - longest-palindromic-substring, coin-change, house-robber, jump-game,
   - find-minimum-in-rotated-sorted-array, search-in-rotated-sorted-array,
   - minimum-window-substring, serialize-and-deserialize-binary-tree, etc.
4. Focus on weak topics primarily
5. Provide a specific, actionable reason for each recommendation

Return ONLY valid JSON array with exactly 9 objects. No markdown, no code blocks.

Format:
[
  {{
    "title": "Two Sum",
    "difficulty": "Easy",
    "topic": "Arrays",
    "reason": "Foundation of hash map technique, critical for your weak Arrays topic.",
    "leetcode_url": "https://leetcode.com/problems/two-sum/"
  }},
  ...
]"""


def generate_recommendations(stats_context: dict) -> list:
    """
    Call Groq to generate 9 problem recommendations.
    Returns a list of recommendation dicts with guaranteed LeetCode URLs.
    """
    prompt = PROMPT_TEMPLATE.format(
        ranking=stats_context.get("ranking", "Unknown"),
        total_solved=stats_context.get("total_solved", 0),
        easy=stats_context.get("easy_solved", 0),
        medium=stats_context.get("medium_solved", 0),
        hard=stats_context.get("hard_solved", 0),
        weak_topics=", ".join(stats_context.get("weak_topics", [])) or "Not analyzed",
        strong_topics=", ".join(stats_context.get("strong_topics", [])) or "Not analyzed",
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        recs = json.loads(raw)
    except json.JSONDecodeError:
        # Try to extract JSON array from response
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if match:
            recs = json.loads(match.group())
        else:
            return []

    # Validate and clean each entry
    valid = []
    for r in recs:
        if not isinstance(r, dict):
            continue
        url = r.get("leetcode_url", "")
        # Ensure URL is valid LeetCode URL
        if not url.startswith("https://leetcode.com/problems/"):
            # Attempt to construct from title
            slug = r.get("title", "").lower().replace(" ", "-").replace("'", "").replace(",", "")
            url = f"https://leetcode.com/problems/{slug}/"
        valid.append({
            "title": r.get("title", "Unknown Problem"),
            "difficulty": r.get("difficulty", "Medium"),
            "topic": r.get("topic", "General"),
            "reason": r.get("reason", "Recommended for skill improvement."),
            "leetcode_url": url,
        })

    return valid
