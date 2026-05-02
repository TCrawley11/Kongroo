import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services import room_manager

router = APIRouter()

# room_id -> { player_id -> WebSocket }
_connections: dict[str, dict[str, WebSocket]] = {}


async def _broadcast(room_id: str) -> None:
    room = room_manager.get_room(room_id)
    conns = _connections.get(room_id, {})
    if not conns:
        return
    payload = json.dumps({
        "type": "room_update",
        "room": room.model_dump() if room else None,
    })
    dead = []
    for pid, ws in conns.items():
        try:
            await ws.send_text(payload)
        except Exception:
            dead.append(pid)
    for pid in dead:
        conns.pop(pid, None)


@router.websocket("/ws/{room_id}")
async def room_ws(
    websocket: WebSocket,
    room_id: str,
    player_id: str = Query(...),
):
    room = room_manager.get_room(room_id)
    if room is None or not any(p.player_id == player_id for p in room.players):
        await websocket.close(code=4004)
        return

    await websocket.accept()
    _connections.setdefault(room_id.upper(), {})[player_id] = websocket

    await _broadcast(room_id)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        _connections.get(room_id.upper(), {}).pop(player_id, None)
        room_manager.remove_player(room_id, player_id)
        await _broadcast(room_id)
