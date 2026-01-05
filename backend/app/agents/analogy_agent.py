from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import AnalogyOutput, AgentState
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def analogy_agent(state: AgentState):
    llm = get_llm(state.model_provider, state.model_name, temperature=0.7)
    parser = PydanticOutputParser(pydantic_object=AnalogyOutput)
    
    loader = PromptLoader()
    prompt = loader.load_prompt("analogy_agent")
    chain = prompt | llm | parser
    
    # Aggregate scientific explanations for context
    explanations_text = "\n".join([f"- {e.principle}: {e.reasoning}" for e in state.scientific_explanations])
    
    result = chain.invoke({
        "scenario": str(state.scenario),
        "explanations": explanations_text,
        "style": state.analogy_style,
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"analogy": result}
