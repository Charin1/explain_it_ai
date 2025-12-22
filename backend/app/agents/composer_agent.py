from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser, JsonOutputParser
from app.schemas import FinalResponse, AgentState, ExperimentOutput, VisualModelOutput, AnalogyOutput
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def composer_agent(state: AgentState):
    # This agent might not need an LLM if it's just aggregating, 
    # but the requirement implies it synthesizes a "Simple Explanation" and "Step-by-step".
    # We can use an LLM to synthesis the final 'Simple Answer' and 'Step-by-Step'.
    
    llm = get_llm(state.model_provider, state.model_name, temperature=0.1)
    
    # We need to parse a complex object, or just text parts. 
    # The FinalResponse schema includes nested objects which are already in State.
    # So we mainly need to generate the "simple_explanation" and "step_by_step" if not already done.
    # Wait, the other agents (Analogy, Visual, Experiment) run AFTER or PARALLEL to this?
    # The architecture says: Expert -> Composer -> Analogy/Visual/Experiment -> Final Output?
    # Actually the diagram showed: Expert -> Composer -> (Analogy, Visual, Experiment)
    # OR: Expert -> Composer -> Final. 
    # Let's look at the diagram:
    # Expert Agents -> Explanation Composer
    #               -> Analogy Agent
    #               -> Visual Model Agent
    #               -> Experiment Agent
    #                    -> Final Output
    # This implies parallel branches after Experts ?? Or Composer aggregates Experts, then passes to Analogy/Visual?
    # Let's assume Composer synthesizes the "Core Explanation" text, and we can aggregate everything at the end.
    
    # Let's treat Composer as the one creating the "Simple Explanation" and "Step-by-Step"
    # based on the Expert findings.
    
    # based on the Expert findings.
    
    loader = PromptLoader()
    prompt = loader.load_prompt("composer_agent")
    chain = prompt | llm | JsonOutputParser()
    
    result = chain.invoke({
        "user_query": state.user_query,
        "scientific_explanations": [e.dict() for e in state.scientific_explanations]
    })
    
    # We can partially update FinalResponse or just store these in state
    # But State doesn't have intermediate fields for these. 
    # Let's create a partial object or update the final response structure in the common State?
    # The AgentState has `final_response: FinalResponse`.
    # But FinalResponse requires Analogy, Visual, Experiment which might not be ready.
    # So we should probably add individual fields to AgentState for flexibility, or construct FinalResponse at the very end.
    # Refactoring AgentState in schemas.py might be needed if we want to store these separately.
    # For now, let's assume we proceed to other agents and there is a "Finalizer" node or we update the keys in a dict.
    # Wait, the `state` in LangGraph is a TypedDict or Pydantic model. We can return a dict to update it.
    
    # I will modify AgentState to hold these intermediate values if they are not already there.
    # Checking schemas.py: AgentState has `final_response`. It doesn't have `simple_explanation`.
    # I should update schemas.py to include `simple_explanation` and `step_by_step` as top level optional fields
    # so agents can write to them independently.
    
    return {
        "simple_explanation": result.get("simple_explanation"),
        "step_by_step": result.get("step_by_step")
    } 
