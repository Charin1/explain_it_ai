from langgraph.graph import StateGraph, END
from app.schemas import AgentState, FinalResponse
from app.agents.scenario_agent import scenario_agent
from app.agents.classifier_agent import classifier_agent
from app.agents.expert_agents import expert_agents_node
from app.agents.composer_agent import composer_agent
from app.agents.analogy_agent import analogy_agent
from app.agents.visual_agent import visual_agent
from app.agents.experiment_agent import experiment_agent

def compile_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("scenario_agent", scenario_agent)
    workflow.add_node("classifier_agent", classifier_agent)
    workflow.add_node("expert_agents", expert_agents_node)
    workflow.add_node("composer_agent", composer_agent)
    workflow.add_node("analogy_agent", analogy_agent)
    workflow.add_node("visual_agent", visual_agent)
    workflow.add_node("experiment_agent", experiment_agent)
    
    # Add finalizer node to construct the FinalResponse object
    def finalizer_node(state: AgentState):
        return {
            "final_response": FinalResponse(
                simple_explanation=state.simple_explanation,
                scientific_explanation=state.scientific_explanations,
                step_by_step=state.step_by_step,
                analogy=state.analogy.analogy if state.analogy else "",
                visual_model=state.visual_model,
                experiment=state.experiment
            )
        }
    workflow.add_node("finalizer", finalizer_node)

    # Define edges
    # Start -> Scenario
    workflow.set_entry_point("scenario_agent")
    
    # Scenario -> Classifier
    workflow.add_edge("scenario_agent", "classifier_agent")
    
    # Classifier -> Expert Agents
    workflow.add_edge("classifier_agent", "expert_agents")
    
    # Expert Agents -> Composer
    workflow.add_edge("expert_agents", "composer_agent")
    
    # Composer -> Analogy, Visual, Experiment (Parallel)
    # LangGraph runs parallel branches if multiple edges originate from one node? 
    # Or strict parallel structure?
    # Simulating parallel by creating edges to all, but need to rejoin.
    # Actually LangGraph executes linearly unless you use map-reduce or parallel branches in a specific way.
    # We can just chain them for simplicity or use parallel structure.
    # Let's chain them linearly for now to avoid complexity of synchronizing state updates if checking overlapping keys.
    # Order: Composer -> Analogy -> Visual -> Experiment -> Final
    
    workflow.add_edge("composer_agent", "analogy_agent")
    workflow.add_edge("analogy_agent", "visual_agent")
    workflow.add_edge("visual_agent", "experiment_agent")
    workflow.add_edge("experiment_agent", "finalizer")
    workflow.add_edge("finalizer", END)

    return workflow.compile()

graph_app = compile_graph()
