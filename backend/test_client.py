from fastapi.testclient import TestClient
from app.main import app
import sys

client = TestClient(app)

def test_models_endpoint():
    print("Testing locally with TestClient...")
    try:
        response = client.get("/models")
        if response.status_code == 200:
            print("SUCCESS: /models endpoint works in TestClient.")
            print(response.json())
        else:
            print(f"FAILURE: /models returned {response.status_code}")
    except Exception as e:
        print(f"FAILURE: Exception calling /models: {e}")

if __name__ == "__main__":
    test_models_endpoint()
