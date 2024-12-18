# AI Audio Transcription - Backend

## Introduction

This is the backend of the AI Audio Transcription web app. It uses the openai/whisper-tiny model for transcribing mp3 audio files. It is built with FastAPI + Python and uses SQLite database.

It is paired with a React + Vite frontend web app.

## Getting Started (Local Development)

1. Clone the repository.

2. Set up a Python virtual environment.

```bash
python -m venv venv
```

3. Activate the virtual environment.

```bash
# On Windows
.\venv\Scripts\activate

# On macOS and Linux
source venv/bin/activate
```

4. Install dependencies.

```bash
pip install -r requirements.txt
```

5. Start the server.

```bash
python -m uvicorn app.main:app --reload
```

## Getting Started (Docker)

The backend comes with `Dockerfile` and `docker-compose.yml` files. To get started with Docker:

1. Clone the repository.

2. In the root directory of the backend project, run the following commands:

```bash
docker-compose build

docker-compose up -d
# or
docker-compose up
```

## Testing

Test files are located in the `tests` directory. To run the test cases, you can run the following command in the root directory in your terminal:

```bash
pytest tests
# or
python -m pytest tests
```