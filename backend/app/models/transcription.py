from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime

class Transcription(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  filename: str = Field(index=True)
  transcribed_text: Optional[str] = Field(default=None)
  created_at: datetime = Field(default_factory=datetime.utcnow)
