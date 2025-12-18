from app.services.prompt_loader import PromptLoader
import sys

def verify_prompts():
    loader = PromptLoader(base_path="app/prompts")
    agents = [
        "analogy_agent",
        "classifier_agent",
        "composer_agent",
        "experiment_agent",
        "expert_agents",
        "scenario_agent",
        "visual_agent"
    ]
    
    failed = []
    
    print("Verifying prompts...")
    for agent in agents:
        try:
            prompt = loader.load_prompt(agent)
            config = loader.load_config(agent)
            print(f"SUCCESS: Loaded prompt for {agent}")
            # print(f"Config: {config}")
        except Exception as e:
            print(f"FAILURE: Could not load prompt for {agent}. Error: {e}")
            failed.append(agent)
            
    if failed:
        print(f"\nFailed to load prompts for: {', '.join(failed)}")
        sys.exit(1)
    else:
        print("\nAll prompts loaded successfully!")
        sys.exit(0)

if __name__ == "__main__":
    verify_prompts()
