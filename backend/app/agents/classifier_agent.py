from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import DomainClassification, AgentState
from app.llm_factory import get_llm
import os

def classifier_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0)
    parser = PydanticOutputParser(pydantic_object=DomainClassification)
    
    template = """
    You are a physics expert. Given a scenario, identify which domains of physics are most relevant to explaining it.
    Choose from: Mechanics, Thermodynamics, Electromagnetism, Fluid Dynamics, Optics, Quantum Mechanics, Acoustics.
    
    Scenario Object: {object}
    Scenario Action: {action}
    
    Format your output as a JSON with a list of domains:
    {format_instructions}
    """
    
    prompt = ChatPromptTemplate.from_template(template)
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
