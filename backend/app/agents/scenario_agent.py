from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import ScenarioOutput, AgentState
from app.llm_factory import get_llm
import os

def scenario_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.1)
    parser = PydanticOutputParser(pydantic_object=ScenarioOutput)
    
    template = """
    Analyze the user's query and extract the core physics scenario.
    Identify the main object involved, the action occurring, and the general phenomenon.
    Also generate a list of 3-5 keywords.
    
    User Query: {query}
    
    Format your output as a JSON object:
    {format_instructions}
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "query": state.user_query,
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"scenario": result}
