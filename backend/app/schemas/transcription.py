from datetime import datetime
from sqlmodel import SQLModel
from typing import Optional

class TranscriptionCreate(SQLModel):
  filename: str
  transcribed_text: Optional[str] = None

class TranscriptionRead(SQLModel):
  id: int
  filename: str
  transcribed_text: Optional[str] = None
  created_at: datetime