from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    # The full collaborative story built from all players' dialogue lines
    story_text: str = Field(..., min_length=1, max_length=4000)
