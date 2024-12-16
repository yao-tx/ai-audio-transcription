from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime

class TranscriptionCreate(SQLModel):
  filename: str
  transcribed_text: Optional[str] = None

class TranscriptionRead(SQLModel):
  id: int
  filename: str
  transcribed_text: Optional[str] = None
  created_at: datetime

class TranscriptionUpdate(SQLModel):
  filename: Optional[str] = None
  transcribed_text: Optional[str] = None
