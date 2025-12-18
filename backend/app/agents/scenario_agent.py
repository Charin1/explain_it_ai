from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import ScenarioOutput, AgentState
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def scenario_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.1)
    parser = PydanticOutputParser(pydantic_object=ScenarioOutput)
    
    loader = PromptLoader()
    prompt = loader.load_prompt("scenario_agent")
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "query": state.user_query,
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"scenario": result}
