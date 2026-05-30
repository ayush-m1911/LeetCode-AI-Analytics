import os
import json
from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

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
{', '.join(weak_topics)}

Strong Topics:
{', '.join(strong_topics)}

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

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
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