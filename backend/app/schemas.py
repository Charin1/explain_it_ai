from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Agent Output Schemas ---

class ScenarioOutput(BaseModel):
    object: str
    action: str
    phenomenon: str
    keywords: List[str]

class DomainClassification(BaseModel):
    domains: List[str]

class ScientificExplanation(BaseModel):
    domain: str
    principle: str
    reasoning: str
    forces_involved: List[str]

class AnalogyOutput(BaseModel):
    analogy: str

class VisualModelOutput(BaseModel):
    # ASCII diagram or structured description
    diagram_content: str
    description: str

class ExperimentOutput(BaseModel):
    experiment_name: str
    materials: List[str]
    steps: List[str]
    safety_note: str

class FinalResponse(BaseModel):
    simple_explanation: str
    scientific_explanation: List[ScientificExplanation]
    step_by_step: List[str]
    analogy: str
    visual_model: VisualModelOutput
    experiment: ExperimentOutput

# --- LangGraph State ---

class AgentState(BaseModel):
    user_query: str
    model_provider: str = "google"
    model_name: str = "gemini-2.5-flash"
    scenario: Optional[ScenarioOutput] = None
    domains: List[str] = []
    scientific_explanations: List[ScientificExplanation] = []
    simple_explanation: Optional[str] = None
    step_by_step: List[str] = []
    analogy: Optional[AnalogyOutput] = None
    visual_model: Optional[VisualModelOutput] = None
    experiment: Optional[ExperimentOutput] = None
    final_response: Optional[FinalResponse] = None
