import sys
import os
import time
import base64
import uuid
from fastapi.testclient import TestClient
import io
from PIL import Image

# Ensure we can import from the current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def run_test():
    print("🚀 Interactive STATEFUL Kongroo VN Tester")
    print("Type your scene prompt and press Enter. Type 'exit' or 'quit' to stop.")
    
    if not os.environ.get("GEMINI_API_KEY"):
        print("❌ ERROR: GEMINI_API_KEY not found in environment.")
        return

    session_id = str(uuid.uuid4())
    print(f"🆔 Session UUID: {session_id}")
    
    scene_count = 1
    while True:
        try:
            prompt = input(f"\n[Scene {scene_count}] Enter prompt: ").strip()
            
            if prompt.lower() in ["exit", "quit"]:
                print("👋 Goodbye!")
                break
            
            if not prompt:
                continue

            print(f"⏳ Generating scene {scene_count}...")
            start_time = time.time()
            
            response = client.post(
                "/api/generate", 
                json={"uuid": session_id, "concise_prompt": prompt}
            )
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Dialogue: {data['dialogue_text']}")
                print(f"⏱️ Took {elapsed:.2f}s")
                
                filename = f"interactive_scene_{scene_count}.png"
                save_img(data['image_base64'], filename)
                scene_count += 1
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ CRASHED: {e}")

def save_img(b64_str, filename):
    img_data = base64.b64decode(b64_str)
    with open(filename, "wb") as f:
        f.write(img_data)
    print(f"📂 Saved image to: {filename}")

if __name__ == "__main__":
    run_test()
