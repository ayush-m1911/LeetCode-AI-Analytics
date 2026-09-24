import os
import json
import re
from groq import Groq


def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured in backend environment variables.")
    return Groq(api_key=api_key)


def generate_dsa_roadmap(goal, total_solved, ranking, weak_topics, strong_topics):
    prompt = f"""
Generate a detailed 30 day DSA roadmap.

User Goal:
{goal}

Current Ranking:
{ranking}

Problems Solved:
{total_solved}

Weak Topics:
{', '.join(weak_topics) if weak_topics else 'Not analyzed yet'}

Strong Topics:
{', '.join(strong_topics) if strong_topics else 'Not analyzed yet'}

Requirements:

1. Week wise plan
2. Daily practice goals
3. Recommended focus areas
4. Difficulty progression
5. Interview preparation advice

Return ONLY valid JSON.
Do NOT wrap the response in:

```json
Format:

{{
    "week1": {{
        "focus_topics": [],
        "daily_goal": "",
        "recommended_problems": []
    }},
    "week2": {{
        ...
    }}
}}
"""

    client = get_groq_client()
    model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )



    import json
    import re

    roadmap = response.choices[0].message.content

    roadmap = roadmap.strip()

    roadmap = re.sub(
    r"^```json\s*",
    "",
    roadmap
)

    roadmap = re.sub(
    r"\s*```$",
    "",
    roadmap
)

    try:
     roadmap_json = json.loads(
        roadmap
    )

     return roadmap_json

    except json.JSONDecodeError:

     return {
        "raw_response": roadmap
    }