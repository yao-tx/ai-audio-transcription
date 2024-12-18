# AI Audio Transcription

This is a full-stack web app that uses the `openai/whisper-mini` model to transcribe mp3 audio files.

It allows users to upload one or more mp3 audio files, and the web app will transcribe the audio files, store the results in database, and display them.

## Tech Stack

- Backend: FastAPI + Python
- Frontend: React + Vite + TypeScript
- Database: SQLite

## Backend

- Built with FastAPI + Python and SQLite as database
- Uses `openai/whisper-mini` model for transcribing audio files

## Frontend

- Built with React + Vite + TypeScript
- TailwindCSS for styling
- react-router-dom for routing

## API Endpoints

`GET /health` : returns the status of the backend service

`POST /transcribe` : accepts one or multiple mp3 audio files, uses AI to transcribe the audio files, save the results into the database, and returns the transcribed results

`GET /transcriptions` : returns all transcription history from the database

`GET /search` : accepts a `term` parameter to perform a search based on the audio file name, and returns the results