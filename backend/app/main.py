from fastapi import FastAPI, File, Depends, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
import os
import uuid

from .schemas import TranscriptionRead, TranscriptionCreate
from .services.transcription_service import TranscriptionService
from .routes.transcriptions import router as transcription_router

from .database import create_db_and_tables
from .models import Transcription

app = FastAPI(title="AI Audio Transcription")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.exception_handler(404)
def custom_404_handler(request: Request, exc):
  return JSONResponse(
    status_code=404,
    content={"code": "not_found", "message": "the requested resource was not found"}
  )

@app.get("/health")
def health_check():
  return {"status": "up and running"}

app.include_router(transcription_router)
