from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import DomainClassification, AgentState
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def classifier_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0)
    parser = PydanticOutputParser(pydantic_object=DomainClassification)
    
    loader = PromptLoader()
    prompt = loader.load_prompt("classifier_agent")
    chain = prompt | llm | parser
    
    scenario = state.scenario
    if not scenario:
        return {"domains": []}

    result = chain.invoke({
        "object": scenario.object,
        "action": scenario.action,
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"domains": result.domains}
