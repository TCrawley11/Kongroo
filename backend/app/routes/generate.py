from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.models.schemas import GenerateRequest, GenerateResponse
from app.services.gemini import generate_scene_image

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate_story_image(request: GenerateRequest):
    try:
        result = await generate_scene_image(request.uuid, request.concise_prompt)
        return GenerateResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
