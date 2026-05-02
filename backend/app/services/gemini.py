import os
import base64
import json
from google import genai
from google.genai import types

MODEL_NAME = "gemini-3.1-flash-image-preview"

_client: genai.Client | None = None
# In-memory session store: maps UUID to chat history
_session_histories: dict[str, list[types.Content]] = {}


def get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY environment variable is not set")
        _client = genai.Client(api_key=api_key)
    return _client


SYSTEM_PROMPT = """\
You are a Visual Novel director and artist. Given a concise scene prompt from the user, your job is to:
1. Elaborate on the visual description for the scene. 
2. Write the dialogue or narration text to display on the screen.
3. Generate a single evocative scene illustration in a Japanese visual novel anime style.

You must maintain strict continuity with the previous scenes in the chat history (characters, setting, tone).
The illustration should have anime-influenced linework, painterly backgrounds, and cinematic lighting. 
Do NOT render any text, speech bubbles, or UI elements inside the image.

Your response must contain:
- A text part: A JSON object with exactly two fields: "elaborated_image_description" and "dialogue_text".
- An image part: The generated illustration for the scene.
"""


async def generate_scene_image(uuid: str, concise_prompt: str) -> dict:
    client = get_client()

    # Get or initialize history for this session
    if uuid not in _session_histories:
        _session_histories[uuid] = []
    history = _session_histories[uuid]

    # Single Turn: Combined Text and Image Generation
    chat = client.chats.create(
        model=MODEL_NAME,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_modalities=["TEXT", "IMAGE"],
        ),
        history=history
    )

    response = chat.send_message(concise_prompt)
    
    dialogue_text = None
    image_bytes = None
    
    # Iterate through parts to find both JSON and Image
    for part in response.candidates[0].content.parts:
        if part.text:
            try:
                # Clean up markdown code blocks if present in the text part
                text_clean = part.text.strip()
                if text_clean.startswith("```json"):
                    text_clean = text_clean[7:-3].strip()
                elif text_clean.startswith("```"):
                    text_clean = text_clean[3:-3].strip()
                
                data = json.loads(text_clean)
                dialogue_text = data.get("dialogue_text")
            except (json.JSONDecodeError, KeyError):
                # Fallback if the model didn't return perfect JSON
                dialogue_text = part.text
        
        if part.inline_data:
            image_bytes = part.inline_data.data

    if not dialogue_text:
        dialogue_text = "..." # Fallback
    
    if not image_bytes:
        raise ValueError("Gemini returned no image in its response")

    # Update persistent history from the chat session
    _session_histories[uuid] = chat.history

    return {
        "dialogue_text": dialogue_text,
        "image_base64": base64.b64encode(image_bytes).decode("utf-8")
    }
