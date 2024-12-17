from fastapi import APIRouter, File, UploadFile
from sqlmodel import Session, select
from typing import List, Optional
import os
import uuid

from ..database import get_session
from ..models import Transcription
from ..schemas import TranscriptionRead, TranscriptionCreate
from ..services.transcription_service import TranscriptionService

router = APIRouter()
transcription_service = TranscriptionService()

@router.post("/transcribe", response_model=List[TranscriptionRead])
async def upload_single_or_multiple_files(files: List[UploadFile] = File(...)):
  transcription_service = TranscriptionService()

  if not files:
    raise HTTPException(status_code=400, detail="No files uploaded")

  transcriptions = []

  for file in files:
    if not file.filename.lower().endswith((".mp3")):
      raise HTTPException(
        status_code=400,
        detail=f"Unsupported file type for {file.filename}"
      )

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("/tmp", unique_filename)

    with open(file_path, "wb") as buffer:
      buffer.write(await file.read())

    try:
      transcription_text = transcription_service.transcribe(file_path)

      print(transcription_text)

    except Exception as e:
      print(f"Error processing {file.filename}: {str(e)}")
    finally:
      os.unlink(file_path)

    return transcriptions