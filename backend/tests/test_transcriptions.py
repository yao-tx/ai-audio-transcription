import io
import os
import pytest

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel

from app.routes.transcriptions import router
from app.database import get_session

# Create a test database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def override_get_session():
    with Session(engine) as session:
        yield session

app = FastAPI()
app.include_router(router)

app.dependency_overrides[get_session] = override_get_session

client = TestClient(app)

# Create a temp database that will be dropped and deleted after all test cases have been completed
@pytest.fixture(scope="session", autouse=True)
def setup_and_teardown():
    # Create the database and tables
    SQLModel.metadata.create_all(engine)
    yield
    # Drop the database and tables
    SQLModel.metadata.drop_all(engine)

    #Remove the database file
    db_file_path = DATABASE_URL.split("///")[-1]
    if os.path.exists(db_file_path):
      os.remove(db_file_path)

def test_get_all_transcriptions_empty():
    response = client.get("/transcriptions")
    assert response.status_code == 200
    assert response.json() == []

def test_search_with_no_search_term():
    response = client.get("/search")
    assert response.status_code == 400
    assert response.json() == {"detail": "Missing search term parameter"}

def test_upload_no_files():
    response = client.post("/transcribe", files={})
    assert response.status_code == 400
    assert response.json() == {"detail": "No files uploaded"}

def test_upload_single_invalid_mp3_file():
  sample_audio_content = b"fake audio content"
  sample_audio_file = io.BytesIO(sample_audio_content)
  sample_audio_file.name = "sample.mp3"

  response = client.post(
    "/transcribe",
    files={"files": ("sample.mp3", sample_audio_file, "audio/mpeg")}
  )

  assert response.status_code == 400
  assert response.json() == {"detail": "Unsupported file type for sample.mp3"}

def test_upload_single_text_file():
  current_dir = os.path.dirname(__file__)
  file_path = os.path.join(current_dir, "audio_samples", "sample.txt")

  with open(file_path, "rb") as f:
    file_content = f.read()

  test_file = io.BytesIO(file_content)
  test_file.name = "sample.txt"

  response = client.post(
    "/transcribe",
    files={"files": ("sample.txt", test_file, "text/plain")}
  )

  assert response.status_code == 400
  assert response.json() == {"detail": "Unsupported file type for sample.txt"}

def test_upload_single_mp3_file():
  current_dir = os.path.dirname(__file__)
  file_path = os.path.join(current_dir, "audio_samples", "Sample 1.mp3")

  with open(file_path, "rb") as f:
    file_content = f.read()

  test_file = io.BytesIO(file_content)
  test_file.name = "Sample 1.mp3"

  response = client.post(
    "/transcribe",
    files={"files": ("Sample 1.mp3", test_file, "audio/mpeg")}
  )

  assert response.status_code == 200
  assert response.json()[0]["filename"] == "Sample 1.mp3"
  assert response.json()[0]["transcribed_text"] == "My name is Ethan. I was asked to come here by 11. Now it is already 3 p.m. They did not even serve me any food or drinks."

def test_upload_multiple_mp3_files():
  current_dir = os.path.dirname(__file__)
  dir_path = os.path.join(current_dir, "audio_samples")

  file_names = ["Sample 2.mp3", "Sample 3.mp3"]
  expected_output = [
    "Help me! I can't find my parents. They told me to wait for them, but I saw this pretty butterfly and followed it.",
    "What should I have for lunch? There's only young tofu, Western, Japanese, economic rice stalls here. I'm sick of the choices here."
  ]

  files = []
  for file_name in file_names:
    file_path = os.path.join(dir_path, file_name)
    with open(file_path, "rb") as f:
      file_content = f.read()
    test_file = io.BytesIO(file_content)
    test_file.name = file_name
    files.append(("files", (file_name, test_file, "audio/mpeg")))

  response = client.post("/transcribe", files=files)
  response_data = response.json()

  assert response.status_code == 200
  assert len(response_data) == len(file_names)
  for i, filename in enumerate(file_names):
    assert response_data[i]["filename"] == filename
    assert response_data[i]["transcribed_text"] == expected_output[i]

def test_search_for_single_result():
  response = client.get("/search?term=Sample%202")
  assert response.status_code == 200
  assert response.json()[0]["filename"] ==  "Sample 2.mp3"

def test_search_for_multiple_results():
  response = client.get("/search?term=sam")
  assert response.status_code == 200
  assert len(response.json()) == 3

def test_get_all_transcriptions():
  response = client.get("/transcriptions")
  assert response.status_code == 200
  assert len(response.json()) == 3