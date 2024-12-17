from fastapi import APIRouter, File, UploadFile, Depends
from sqlmodel import Session, select
from sqlalchemy import desc
from typing import List, Optional
import os
import uuid
import magic

from ..database import get_session
from ..models import Transcription
from ..schemas import TranscriptionRead, TranscriptionCreate
from ..services.transcription_service import TranscriptionService

router = APIRouter()
transcription_service = TranscriptionService()

@router.get("/transcriptions", response_model=List[TranscriptionRead])
async def get_all_transcriptions(db: Session = Depends(get_session)):
  statement = select(Transcription).order_by(desc(Transcription.created_at))
  results = db.exec(statement).all()

  return results


@router.post("/transcribe", response_model=List[TranscriptionCreate])
async def upload_single_or_multiple_files(
  files: List[UploadFile] = File(...),
  db: Session = Depends(get_session)
):
  transcription_service = TranscriptionService()

  if not files:
    raise HTTPException(status_code=400, detail="No files uploaded")

  transcriptions = []

  for file in files:
    mime = magic.Magic(mime=True, uncompress=True)
    file_type = mime.from_buffer(file.file.read(1024))
    if file_type != "audio/mpeg":
      raise HTTPException(
        status_code=400,
        detail=f"Unsupported file type for {file.filename}"
      )

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("/tmp", unique_filename)

    with open(file_path, "wb") as buffer:
      buffer.write(await file.read())

    try:
      full_transcribed_text = ""
      transcribed_texts = transcription_service.transcribe(file_path)
      print(transcribed_texts)

      for transcribed_text in transcribed_texts:
        full_transcribed_text += transcribed_text

      transcription_data = TranscriptionCreate(
        filename=file.filename,
        transcribed_text=full_transcribed_text
      )

      transcription = Transcription(**transcription_data.dict())
      db.add(transcription)
      db.commit()
      db.refresh(transcription)

      transcriptions.append({
        "filename": transcription.filename,
        "transcribed_text": transcription.transcribed_text
      })
    except Exception as e:
      print(f"Error processing {file.filename}: {str(e)}")
    finally:
      os.unlink(file_path)

  return transcriptions