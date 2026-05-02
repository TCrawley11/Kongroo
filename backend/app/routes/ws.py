import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services import room_manager

router = APIRouter()

# room_id -> { player_id -> WebSocket }
_connections: dict[str, dict[str, WebSocket]] = {}


async def _broadcast(room_id: str, payload: dict) -> None:
    conns = _connections.get(room_id.upper(), {})
    dead = []
    for pid, ws in conns.items():
        try:
            await ws.send_json(payload)
        except Exception:
            dead.append(pid)
    for pid in dead:
        conns.pop(pid, None)


async def _broadcast_room_update(room_id: str) -> None:
    room = room_manager.get_room(room_id)
    await _broadcast(room_id, {
        "type": "room_update",
        "room": room.model_dump() if room else None,
    })


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

    await _broadcast_room_update(room_id)

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except Exception:
                continue

            kind = data.get("type")

            if kind == "chat":
                msg = str(data.get("message", ""))[:500].strip()
                if not msg:
                    continue
                room = room_manager.get_room(room_id)
                sender = next((p for p in (room.players if room else []) if p.player_id == player_id), None)
                username = sender.display_name if sender else "Unknown"
                await _broadcast(room_id, {
                    "type": "chat",
                    "username": username,
                    "message": msg,
                })

            elif kind == "start_game":
                room = room_manager.get_room(room_id)
                if room is None:
                    continue
                host = next((p for p in room.players if p.is_host), None)
                if host and host.player_id == player_id:
                    room_manager.start_room(room_id)
                    await _broadcast(room_id, {"type": "game_started"})

    except WebSocketDisconnect:
        _connections.get(room_id.upper(), {}).pop(player_id, None)
        room_manager.remove_player(room_id, player_id)
        await _broadcast_room_update(room_id)
