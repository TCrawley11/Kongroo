import random
import string
from app.models.schemas import Player, Room

_rooms: dict[str, Room] = {}

MAX_PLAYERS = 4
CODE_LENGTH = 6


def _unique_code() -> str:
    chars = string.ascii_uppercase + string.digits
    while True:
        code = "".join(random.choices(chars, k=CODE_LENGTH))
        if code not in _rooms:
            return code


def create_room(player_id: str, display_name: str) -> Room:
    room_id = _unique_code()
    host = Player(player_id=player_id, display_name=display_name, is_host=True)
    room = Room(room_id=room_id, players=[host])
    _rooms[room_id] = room
    return room


def get_room(room_id: str) -> Room | None:
    return _rooms.get(room_id.upper())


def join_room(room_id: str, player_id: str, display_name: str) -> Room:
    room = get_room(room_id)
    if room is None:
        raise ValueError("Room not found")
    if room.status != "waiting":
        raise ValueError("Room is no longer accepting players")
    if len(room.players) >= MAX_PLAYERS:
        raise ValueError("Room is full (max 4 players)")
    if any(p.player_id == player_id for p in room.players):
        return room
    room.players.append(Player(player_id=player_id, display_name=display_name))
    return room


def remove_player(room_id: str, player_id: str) -> Room | None:
    room = get_room(room_id)
    if room is None:
        return None
    room.players = [p for p in room.players if p.player_id != player_id]
    if not room.players:
        del _rooms[room_id.upper()]
        return None
    if not any(p.is_host for p in room.players):
        room.players[0].is_host = True
    return room
