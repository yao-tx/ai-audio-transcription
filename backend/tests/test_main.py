import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
  response = client.get("/health")
  assert response.status_code == 200
  assert response.json() == {"status": "up and running"}

def test_404():
  response = client.get("/invalid-path")
  assert response.status_code == 404
  assert response.json() == {"code": "not_found", "message": "the requested resource was not found"}