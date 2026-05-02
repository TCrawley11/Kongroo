from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.models.schemas import GenerateRequest
from app.services.gemini import generate_scene_image

router = APIRouter()


@router.post("/generate", response_class=Response)
async def generate_story_image(request: GenerateRequest):
    try:
        image_bytes = await generate_scene_image(request.story_text)
        return Response(content=image_bytes, media_type="image/png")
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
