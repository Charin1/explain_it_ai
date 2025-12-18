import os
import yaml
from langchain_core.prompts import ChatPromptTemplate

class PromptLoader:
    def __init__(self, base_path: str = "app/prompts"):
        self.base_path = base_path

    def load_prompt(self, agent_name: str) -> ChatPromptTemplate:
        prompt_path = os.path.join(self.base_path, agent_name, "prompt.md")
        config_path = os.path.join(self.base_path, agent_name, "config.yaml")

        if not os.path.exists(prompt_path):
            raise FileNotFoundError(f"Prompt file not found: {prompt_path}")

        with open(prompt_path, "r") as f:
            template = f.read()

        return ChatPromptTemplate.from_template(template)

    def load_config(self, agent_name: str) -> dict:
        config_path = os.path.join(self.base_path, agent_name, "config.yaml")
        
        if os.path.exists(config_path):
             with open(config_path, "r") as f:
                return yaml.safe_load(f)
        return {}
