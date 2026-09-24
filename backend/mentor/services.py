import os
from groq import Groq


def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured in backend environment variables.")
    return Groq(api_key=api_key)


SYSTEM_PROMPT = """You are an expert DSA (Data Structures & Algorithms) mentor and LeetCode coach.

You help competitive programmers improve their skills, identify weaknesses, and prepare for technical interviews.
You are direct, encouraging, and highly knowledgeable.
Always give actionable, specific advice tailored to the user's stats.
When suggesting problems, reference real LeetCode problem names.
Keep responses concise but impactful — use markdown formatting with bullet points."""


def _build_mentor_messages(user_message: str, stats_context: dict, history: list) -> list:
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
    return messages


def ask_mentor(user_message: str, stats_context: dict, history: list) -> str:
    """
    Call Groq with user message + injected stats context + chat history.
    Returns the AI reply string.
    """
    messages = _build_mentor_messages(user_message, stats_context, history)
    client = get_groq_client()
    model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    response = client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=0.75,
        max_tokens=1024
    )

    return response.choices[0].message.content


def stream_mentor(user_message: str, stats_context: dict, history: list):
    """
    Stream Groq completion tokens for real-time SSE chat responses.
    """
    messages = _build_mentor_messages(user_message, stats_context, history)
    client = get_groq_client()
    model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    stream = client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=0.75,
        max_tokens=1024,
        stream=True
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content if chunk.choices else ""
        if delta:
            yield delta


