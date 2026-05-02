import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services import room_manager

router = APIRouter()

# room_id -> { player_id -> WebSocket }
_connections: dict[str, dict[str, WebSocket]] = {}

# room_id -> { turn_index, player_ids, submissions, players_data }
_game_state: dict[str, dict] = {}


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

    # Reconnect: send current game state if a round is in progress
    game = _game_state.get(room_id.upper())
    if game:
        current_id = (
            game["player_ids"][game["turn_index"]]
            if game["turn_index"] < len(game["player_ids"])
            else None
        )
        await websocket.send_json({
            "type": "game_state_update",
            "current_player_id": current_id,
            "submissions": game["submissions"],
            "players": game["players_data"],
        })

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
                if not (host and host.player_id == player_id):
                    continue
                room_manager.start_room(room_id)
                room = room_manager.get_room(room_id)
                player_ids = [p.player_id for p in room.players]
                players_data = [
                    {"player_id": p.player_id, "display_name": p.display_name, "is_host": p.is_host}
                    for p in room.players
                ]
                _game_state[room_id.upper()] = {
                    "turn_index": 0,
                    "player_ids": player_ids,
                    "submissions": [],
                    "players_data": players_data,
                }
                await _broadcast(room_id, {
                    "type": "game_started",
                    "current_player_id": player_ids[0] if player_ids else None,
                    "players": players_data,
                })

            elif kind == "submit_sentence":
                game = _game_state.get(room_id.upper())
                if not game or game["turn_index"] >= len(game["player_ids"]):
                    continue
                if game["player_ids"][game["turn_index"]] != player_id:
                    continue

                text = str(data.get("text", ""))[:300].strip()
                if not text:
                    continue

                room = room_manager.get_room(room_id)
                player_name = next(
                    (p.display_name for p in (room.players if room else []) if p.player_id == player_id),
                    "Unknown",
                )
                game["submissions"].append({
                    "player_id": player_id,
                    "player_name": player_name,
                    "text": text,
                })
                game["turn_index"] += 1

                if game["turn_index"] >= len(game["player_ids"]):
                    await _broadcast(room_id, {
                        "type": "game_complete",
                        "submissions": game["submissions"],
                    })
                    _game_state.pop(room_id.upper(), None)
                else:
                    await _broadcast(room_id, {
                        "type": "turn_update",
                        "current_player_id": game["player_ids"][game["turn_index"]],
                        "submissions": game["submissions"],
                    })

    except WebSocketDisconnect:
        _connections.get(room_id.upper(), {}).pop(player_id, None)
        room_manager.remove_player(room_id, player_id)
        await _broadcast_room_update(room_id)
