import asyncio
import logging
from uagents import Bureau, Agent
from data_schemas import QueryMessage
from agents import (
    prompt_agent, scraper_agent, data_cleaning_agent,
    eda_agent, model_training_agent, report_agent
)

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Bureau (container for all agents)
bureau = Bureau()

# Register all agents
bureau.add(prompt_agent)
bureau.add(scraper_agent)
bureau.add(data_cleaning_agent)
bureau.add(eda_agent)
bureau.add(model_training_agent)
bureau.add(report_agent)

# Test Agent to trigger the pipeline
test_agent = Agent(name="test_agent")

@test_agent.on_event("startup")
async def send_message(ctx):
    await asyncio.sleep(3)  # Ensure agents have started before sending message
    message = QueryMessage(query="Cricket trends in 2025")
    print(f"[test_agent] Sending initial query: {message.query}")
    await ctx.send(prompt_agent.address, message)

bureau.add(test_agent)

# Run all agents asynchronously
if __name__ == "__main__":
    print("[main.py] Starting Bureau with all agents...")
    bureau.run()