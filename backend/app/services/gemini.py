import os
from google import genai
from google.genai import types
from app.core.config import settings

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
You are a colored-manga and visual-novel illustrator. Given a collaborative story written by \
multiple players, produce a single evocative scene illustration in a colored manga / Japanese \
visual novel style: bold inked linework with confident black outlines, cel-shaded coloring with \
clean flat fills and crisp shadows, screentone-influenced texture and hatching, vibrant saturated \
palette, dynamic manga-style composition with strong perspective, expressive anime character \
features (large eyes, stylized hair), painted atmospheric backgrounds, cinematic dramatic \
lighting. The image should look like a full-color page from a premium shōnen or seinen manga or \
a key art still from a modern visual novel — never photorealistic, never Western cartoon, never \
3D render. Do NOT render any text, speech bubbles, sound effects, captions, signatures, \
watermarks, or UI elements inside the image itself.\
"""


def build_image_prompt(story_text: str) -> str:
    return (
        "Illustrate the following collaborative story as a single colored-manga / visual-novel "
        "scene. Use bold inked outlines, cel-shaded anime coloring, screentone texture, vibrant "
        "saturated colors, and a painted atmospheric background. Capture the setting, mood, and "
        "the key dramatic moment. No text or speech bubbles in the image.\n\n"
        f"Story:\n{story_text}"
    )


async def generate_scene_image(story_text: str) -> bytes:
    client = get_client()
    prompt = build_image_prompt(story_text)

    response = client.models.generate_content(
        model=settings.gemini.model_id,
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
