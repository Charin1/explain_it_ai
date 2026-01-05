from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.graph import graph_app
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Everyday Physics Explain-It Bot")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExplainRequest(BaseModel):
    query: str
    model_provider: str = "google"
    model_name: str = "gemini-2.5-flash"
    analogy_style: str = "General"

@app.get("/")
async def root():
    return {"message": "Welcome to Everyday Physics Explain-It Bot API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/models")
async def get_models():
    """
    Returns a list of available models.
    """
    return {
        "models": [
            {"provider": "google", "name": "gemini-2.5-flash", "label": "Gemini 2.5 Flash"},
            {"provider": "groq", "name": "openai/gpt-oss-120b", "label": "GPT-OSS 120B (Groq)"},
            {"provider": "groq", "name": "llama-3.3-70b-versatile", "label": "Llama 3.3 70B (Groq)"},
            {"provider": "groq", "name": "llama-3.1-8b-instant", "label": "Llama 3.1 8B (Groq)"},
            {"provider": "groq", "name": "mixtral-8x7b-32768", "label": "Mixtral 8x7B (Groq)"},
        ]
    }

@app.post("/explain")
async def explain(py_req: ExplainRequest):
    try:
        # Initial state
        initial_state = {
            "user_query": py_req.query,
            "model_provider": py_req.model_provider,
            "model_name": py_req.model_name,
            "analogy_style": py_req.analogy_style
        }
        
        # Invoke graph
        # invoke returns the final state
        final_state = await graph_app.ainvoke(initial_state)
        
        return final_state.get("final_response")
        
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/surprise")
async def surprise_me(py_req: ExplainRequest):
    try:
        from app.llm_factory import get_llm
        from langchain_core.messages import HumanMessage
        
        llm = get_llm(py_req.model_provider, py_req.model_name)
        
        prompt = """Generate 3 very short, intriguing, and common "why" or "how" questions about everyday physics phenomena that a curious person might ask. 
        Examples: "Why is the sky blue?", "How do magnets work?", "Why does ice float?".
        Return ONLY the 3 questions separated by newlines. Do not number them."""
        
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        questions = [q.strip() for q in content.split('\n') if q.strip()]
        # Ensure we have at most 3
        questions = questions[:3]
        
        return {"questions": questions}
        
    except Exception as e:
        print(f"Error generating surprise questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))
