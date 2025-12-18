from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import ScientificExplanation, AgentState
from app.llm_factory import get_llm
from app.services.prompt_loader import PromptLoader
import os

def expert_agents_node(state: AgentState):
    domains = state.domains
    scenario = state.scenario
    
    explanations = []
    
    # We could simulate parallel execution here by just looping, 
    # since we are inside a single node. 
    # In a full agentic system each expert could be a node.
    # For simplicity, we iterate.
    
    for domain in domains:
        llm = get_llm(state.model_provider, state.model_name, temperature=0.2)
        parser = PydanticOutputParser(pydantic_object=ScientificExplanation)
        
        loader = PromptLoader()
        prompt = loader.load_prompt("expert_agents")
        chain = prompt | llm | parser
        
        try:
            result = chain.invoke({
                "domain": domain,
                "object": scenario.object,
                "action": scenario.action,
                "phenomenon": scenario.phenomenon,
                "format_instructions": parser.get_format_instructions()
            })
            explanations.append(result)
        except Exception as e:
            # Fallback or error logging
            print(f"Error in {domain} agent: {e}")
            
    return {"scientific_explanations": explanations}
