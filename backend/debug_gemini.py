from app.llm_factory import get_llm
from dotenv import load_dotenv
import os

load_dotenv()

def test_gemini():
    # Test the model defined in main.py
    model_name = "gemini-1.5-flash"
    print(f"Testing Gemini model: {model_name}")
    
    if not os.getenv("GOOGLE_API_KEY"):
        print("FAILURE: GOOGLE_API_KEY not found in env.")
        return

    try:
        llm = get_llm("google", model_name)
        response = llm.invoke("Hello, are you working?")
        print(f"SUCCESS: Response: {response.content}")
    except Exception as e:
        print(f"FAILURE: Error invoking {model_name}: {e}")
        
    # Test a known working model just in case
    fallback_model = "gemini-1.5-flash" 
    print(f"\nTesting fallback model: {fallback_model}")
    try:
        llm = get_llm("google", fallback_model)
        response = llm.invoke("Hello, are you working?")
        print(f"SUCCESS: Response: {response.content}")
    except Exception as e:
        print(f"FAILURE: Error invoking {fallback_model}: {e}")

if __name__ == "__main__":
    test_gemini()
