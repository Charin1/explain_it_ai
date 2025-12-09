from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
import os

def get_llm(provider: str, model_name: str, temperature: float = 0.7):
    """
    Factory function to return the configured LLM instance.
    """
    if provider.lower() == "groq":
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            # Fallback or error? For now, let it fail natively if key is missing or rely on env
            pass
        return ChatGroq(
            model_name=model_name,
            temperature=temperature
        )
    else:
        # Default to Google/Gemini
        return ChatGoogleGenerativeAI(
            model=model_name,
            temperature=temperature
        )
