from pathlib import Path
import tomllib
from pydantic import BaseModel

class GeminiSettings(BaseModel):
    model_id: str = "gemini-2.0-flash-exp"

class Settings(BaseModel):
    gemini: GeminiSettings = GeminiSettings()

def load_settings() -> Settings:
    config_path = Path(__file__).parent.parent.parent / "config.toml"
    if not config_path.exists():
        return Settings()
    
    with open(config_path, "rb") as f:
        data = tomllib.load(f)
    return Settings(**data)

settings = load_settings()
