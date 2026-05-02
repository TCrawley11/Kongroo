from fastapi import APIRouter, HTTPException
from app.models.schemas import CreateRoomRequest, JoinRoomRequest, Room
from app.services import room_manager

router = APIRouter()


@router.post("/rooms", response_model=Room, status_code=201)
def create_room(request: CreateRoomRequest):
    return room_manager.create_room(request.player_id, request.display_name)


@router.get("/rooms/{room_id}", response_model=Room)
def get_room(room_id: str):
    room = room_manager.get_room(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.post("/rooms/{room_id}/join", response_model=Room)
def join_room(room_id: str, request: JoinRoomRequest):
    try:
        return room_manager.join_room(room_id, request.player_id, request.display_name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
