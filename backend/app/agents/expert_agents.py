from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas import ScientificExplanation, AgentState
from app.llm_factory import get_llm
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
        
        template = """
        You are an expert in {domain}.
        Explain the following scenario using principles from your domain.
        
        Scenario: {object} {action}
        Phenomenon: {phenomenon}
        
        Provide the core principle, reasoning, and forces involved.
        
        Format output as JSON:
        {format_instructions}
        """
        
        prompt = ChatPromptTemplate.from_template(template)
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
