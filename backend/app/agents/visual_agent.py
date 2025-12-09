from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import VisualModelOutput, AgentState
from app.llm_factory import get_llm
import os

def visual_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.2)
    parser = PydanticOutputParser(pydantic_object=VisualModelOutput)
    
    template = """
    You are a visual thinker.
    Create a text-based conceptual diagram (ASCII art or structured flow) to visualize the physics phenomenon.
    
    Scenario: {scenario}
    Explanation: {simple_explanation}
    
    Also provide a brief description of what the diagram represents.
    
    Format output as JSON:
    {format_instructions}
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "scenario": str(state.scenario),
        "simple_explanation": state.simple_explanation,
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"visual_model": result}
