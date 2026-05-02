import os
import sys
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Add the current directory to sys.path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

load_dotenv()

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

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ ERROR: GEMINI_API_KEY not found in environment.")
        return

    client = genai.Client(api_key=api_key)
    model_id = settings.gemini.model_id
    
    print(f"🚀 Starting Kongroo Chat Session")
    print(f"🤖 Model: {model_id}")
    print(f"📝 System Instruction: Visual Novel Artist")
    print("-" * 40)
    print("Type 'exit' or 'quit' to stop.")

    history = []
    turn = 1

    while True:
        try:
            prompt = input(f"\n[{turn}] Prompt > ")
            if prompt.lower() in ["exit", "quit"]:
                break
            if not prompt.strip():
                continue

            # Add wrapped user prompt to history
            wrapped_prompt = build_image_prompt(prompt)
            history.append(types.Content(
                role="user",
                parts=[types.Part(text=wrapped_prompt)]
            ))

            print(f"⏳ Generating image for turn {turn}...")
            
            response = client.models.generate_content(
                model=model_id,
                contents=history,
                config=types.GenerateContentConfig(
                    system_instruction=VISUAL_NOVEL_SYSTEM_PROMPT,
                    response_modalities=["IMAGE"],
                ),
            )

            # Check for candidate and content
            candidate = response.candidates[0]
            image_data = None
            
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if part.inline_data:
                        image_data = part.inline_data.data
                        break
            
            if image_data:
                filename = f"chat_turn_{turn}.png"
                with open(filename, "wb") as f:
                    f.write(image_data)
                print(f"✅ Success! Image saved as '{filename}'")
                
                # Add model's response back to history 
                history.append(candidate.content)
                turn += 1
            else:
                print(f"⚠️  No image returned. Finish reason: {candidate.finish_reason}")
                if candidate.safety_ratings:
                    blocked = [r for r in candidate.safety_ratings if r.blocked]
                    if blocked:
                        print(f"🚫 Safety block triggered: {blocked}")
                
                # If there's content but no image (e.g. model sent text instead)
                if candidate.content:
                    history.append(candidate.content)
                else:
                    # If content is None, we need to decide how to handle history.
                    # Usually, we shouldn't append None to history as it might break the next call.
                    print("❌ Response blocked or empty. Not adding to history.")

        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
