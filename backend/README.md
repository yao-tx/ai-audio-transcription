# AI Audio Transcription - Backend

## Introduction

This is the backend of the AI Audio Transcription web app. It uses the openai/whisper-tiny model for transcribing mp3 audio files.

It is built with FastAPI and uses sqlite database internally.

It is paired with a React + Vite frontend web app.

## Get Started with Docker

The backend comes with `Dockerfile` and `docker-compose.yml` files. To get started with Docker, make sure you are in the root directory of the backend project, and run the following commands in your terminal:

```
# docker-compose build
# docker-compose up -d
```

## Testing

Test files are located in the `tests` directory. To run the tests, you can run the following command in the root directory in your terminal:

```
# pytest tests
```