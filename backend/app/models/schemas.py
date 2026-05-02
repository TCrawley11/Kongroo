from typing import Literal
from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    # The full collaborative story built from all players' dialogue lines
    story_text: str = Field(..., min_length=1, max_length=4000)


class Player(BaseModel):
    player_id: str
    display_name: str
    is_host: bool = False


class Room(BaseModel):
    room_id: str
    players: list[Player] = []
    status: Literal["waiting", "playing", "done"] = "waiting"
    max_players: int = 4


class CreateRoomRequest(BaseModel):
    player_id: str
    display_name: str = Field(..., min_length=1, max_length=32)


class JoinRoomRequest(BaseModel):
    player_id: str
    display_name: str = Field(..., min_length=1, max_length=32)
