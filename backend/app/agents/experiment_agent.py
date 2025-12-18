from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import ExperimentOutput, AgentState
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def experiment_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.5)
    parser = PydanticOutputParser(pydantic_object=ExperimentOutput)
    
    loader = PromptLoader()
    prompt = loader.load_prompt("experiment_agent")
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "scenario": str(state.scenario),
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"experiment": result}
