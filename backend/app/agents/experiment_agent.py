from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import ExperimentOutput, AgentState
from app.llm_factory import get_llm
import os

def experiment_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.5)
    parser = PydanticOutputParser(pydantic_object=ExperimentOutput)
    
    template = """
    You are a science teacher.
    Suggest a safe, easy "Try It At Home" experiment to demonstrate the physics concept.
    
    Scenario: {scenario}
    
    Ensure materials are common household items.
    Include safety notes.
    
    Format output as JSON:
    {format_instructions}
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "scenario": str(state.scenario),
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"experiment": result}
