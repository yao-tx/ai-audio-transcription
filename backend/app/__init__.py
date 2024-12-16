"""
AI Audio Transcription Backend

This package is a FastAPI-based backend service for audio transcription using the Whisper speech regonition model.
"""

import logging

logging.basicConfig(
  level=logging.INFO,
  format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

__version__="1.0.0"