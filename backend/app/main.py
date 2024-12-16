from fastapi import FastAPI, File, Depends, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from typing import List
import os
import uuid

from .database import create_db_and_tables, get_session
from .models import Transcription


app = FastAPI(title="AI Audio Transcription")

@app.exception_handler(404)
def custom_404_handler(request: Request, exc):
  return JSONResponse(
    status_code=404,
    content={"code": "not_found", "message": "the requested resource was not found"}
  )

@app.get("/health")
def health_check():
  return {"status": "up and running"}