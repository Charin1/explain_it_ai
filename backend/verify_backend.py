import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000"

def test_get_models():
    print("Testing GET /models...")
    try:
        response = requests.get(f"{BASE_URL}/models")
        if response.status_code == 200:
            data = response.json()
            print("SUCCESS: /models returned:")
            print(json.dumps(data, indent=2))
            
            # Check for specific models
            models = data.get("models", [])
            has_gemini = any(m["provider"] == "google" and m["name"] == "gemini-2.5-flash" for m in models)
            has_groq = any(m["provider"] == "groq" and "llama" in m["name"] for m in models)
            
            if has_gemini and has_groq:
                print("SUCCESS: Found expected Gemini and Groq models.")
            else:
                print("FAILURE: Missing expected models.")
                sys.exit(1)
        else:
            print(f"FAILURE: /models returned {response.status_code}")
            print(response.text)
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("FAILURE: Could not connect to backend. Is it running?")
        sys.exit(1)

def main():
    test_get_models()
    # verify explain not implemented in this quick check as it requires AI keys and takes time, 
    # but /models proves the code update is active.
    print("\nBackend verification passed!")

if __name__ == "__main__":
    main()
