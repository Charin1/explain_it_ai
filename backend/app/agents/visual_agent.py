from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import VisualModelOutput, AgentState
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def visual_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.2)
    parser = PydanticOutputParser(pydantic_object=VisualModelOutput)
    
    loader = PromptLoader()
    prompt = loader.load_prompt("visual_agent")
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "scenario": str(state.scenario),
        "simple_explanation": state.simple_explanation,
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"visual_model": result}
