import sys
import os
import time
from fastapi.testclient import TestClient
import io
from PIL import Image

# Ensure we can import from the current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def run_test():
    print("🚀 Testing Kongroo Image Generation Pipeline...")
    
    # Check for API key
    if not os.environ.get("GEMINI_API_KEY"):
        print("❌ ERROR: GEMINI_API_KEY not found in environment.")
        return

    story_text = (
        "A detective arrives at a rainy crime scene in Neo-Tokyo. "
        "The neon signs reflect in the puddles on the pavement."
    )

    print(f"POSTing to /api/generate...")
    
    start_time = time.time()
    try:
        response = client.post(
            "/api/generate",
            json={"story_text": story_text}
        )
        elapsed_time = time.time() - start_time
    except Exception as e:
        print(f"❌ CRASHED: {e}")
        return

    if response.status_code == 200:
        print(f"✅ SUCCESS! (Took {elapsed_time:.2f} seconds)")
        with open("test_output.png", "wb") as f:
            f.write(response.content)
        print("📂 Result saved to: backend/test_output.png")
        
        # Open the image to check dimensions
        img = Image.open(io.BytesIO(response.content))
        print(f"🖼️  Generated Image: {img.size[0]}x{img.size[1]} {img.format}")
    else:
        print(f"❌ FAILED (Status {response.status_code})")
        print(f"Error Detail: {response.text}")

if __name__ == "__main__":
    run_test()
