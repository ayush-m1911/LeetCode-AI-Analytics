import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an expert DSA (Data Structures & Algorithms) mentor and LeetCode coach.
You help competitive programmers improve their skills, identify weaknesses, and prepare for technical interviews.
You are direct, encouraging, and highly knowledgeable.
Always give actionable, specific advice tailored to the user's stats.
When suggesting problems, reference real LeetCode problem names.
Keep responses concise but impactful — use markdown formatting with bullet points."""


def ask_mentor(user_message: str, stats_context: dict, history: list) -> str:
    """
    Call Groq with user message + injected stats context + chat history.
    Returns the AI reply string.
    """
    ranking = stats_context.get("ranking", "Unknown")
    total_solved = stats_context.get("total_solved", 0)
    easy = stats_context.get("easy_solved", 0)
    medium = stats_context.get("medium_solved", 0)
    hard = stats_context.get("hard_solved", 0)
    weak_topics = stats_context.get("weak_topics", [])
    strong_topics = stats_context.get("strong_topics", [])

    context_block = f"""
[USER PROFILE]
- Global Ranking: {ranking}
- Total Problems Solved: {total_solved} (Easy: {easy}, Medium: {medium}, Hard: {hard})
- Weak Topics (needs improvement): {', '.join(weak_topics) if weak_topics else 'Not analyzed yet'}
- Strong Topics (doing well): {', '.join(strong_topics) if strong_topics else 'Not analyzed yet'}
"""

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT + "\n\n" + context_block
        }
    ]

    # Include recent history (last 20 messages for context window)
    for msg in history[-20:]:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    # Append current user message
    messages.append({
        "role": "user",
        "content": user_message
    })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.75,
        max_tokens=1024
    )

    return response.choices[0].message.content
