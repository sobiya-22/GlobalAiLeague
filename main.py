import asyncio
import logging
from uagents import Bureau
from agents import (
    prompt_agent,
    scraper_agent,
    data_cleaning_agent,
    eda_agent,
    model_training_agent,
    report_agent,
    setup_ai_tools,
    analysis_results
)
from data_schemas import QueryMessage

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    setup_ai_tools()

    query = input("Enter your search query (e.g., 'Cricket trends in 2025'): ").strip()
    if not query:
        query = "Cricket trends in 2025"
    
    analysis_results["query"] = query

    bureau = Bureau()

    # Register all agents
    bureau.add(prompt_agent)
    bureau.add(scraper_agent)
    bureau.add(data_cleaning_agent)
    bureau.add(eda_agent)
    bureau.add(model_training_agent)
    bureau.add(report_agent)

    logger.info("Starting agent bureau...")

    # 🟢 THIS LINE IS MISSING IN YOUR VERSION
    bureau.run()

if __name__ == "__main__":
    main()
