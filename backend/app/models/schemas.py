from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    # Unique identifier for the player's session to maintain context
    uuid: str = Field(..., description="Unique session ID")
    # A short instruction for the next scene
    concise_prompt: str = Field(..., min_length=1, max_length=1000)


class GenerateResponse(BaseModel):
    # The elaborated dialogue text to display
    dialogue_text: str
    # The generated image as a base64 string
    image_base64: str
