import os
from google import genai
from google.genai import types

IMAGE_MODEL = "gemini-3.1-flash-image-preview"

_client: genai.Client | None = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY environment variable is not set")
        _client = genai.Client(api_key=api_key)
    return _client


VISUAL_NOVEL_SYSTEM_PROMPT = """\
You are a visual novel scene artist. Given a collaborative story written by multiple players, \
produce a single evocative scene illustration in a Japanese visual novel style: \
anime-influenced linework, painterly backgrounds, cinematic lighting, rich atmospheric color. \
The image should feel like a still frame from a professional visual novel — \
expressive and emotionally resonant with the story's current tone. \
Do NOT render any text, speech bubbles, or UI elements inside the image itself.\
"""


def build_image_prompt(story_text: str) -> str:
    return (
        "Create a visual novel scene illustration for the following collaborative story. "
        "Capture the setting, mood, and key dramatic moment described.\n\n"
        f"Story:\n{story_text}"
    )


async def generate_scene_image(story_text: str) -> bytes:
    client = get_client()
    prompt = build_image_prompt(story_text)

    response = client.models.generate_content(
        model=IMAGE_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=VISUAL_NOVEL_SYSTEM_PROMPT,
            response_modalities=["IMAGE"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            return part.inline_data.data

    raise ValueError("Gemini returned no image in its response")
