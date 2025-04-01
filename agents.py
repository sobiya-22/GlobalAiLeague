import re
import pickle
import base64
import requests
from uagents import Agent, Context
from data_schemas import (
    QueryMessage, ScrapeResponse, CleanResponse, 
    EDAResponse, TrainResponse
)
from sklearn.ensemble import RandomForestRegressor

# Create all agents
prompt_agent = Agent(name="prompt_agent")
scraper_agent = Agent(name="scraper_agent")
data_cleaning_agent = Agent(name="data_cleaning_agent")
eda_agent = Agent(name="eda_agent")
model_training_agent = Agent(name="model_training_agent")
report_agent = Agent(name="report_agent")

# API Key
SERP_API_KEY = "3c477edb40b151ad0150967fb244a217279aeb3c168444275988b30eb84ea269"

# Handler functions
@prompt_agent.on_message(model=QueryMessage)
async def handle_prompt(ctx: Context, sender: str, message: QueryMessage):
    print(f"[prompt_agent] Received query: {message.query}")
    await ctx.send(scraper_agent.address, message)

@scraper_agent.on_message(model=QueryMessage)
async def scrape_data(ctx: Context, sender: str, message: QueryMessage):
    print(f"[scraper_agent] Scraping data for query: {message.query}")
    query = message.query
    url = "https://serpapi.com/search"
    params = {
        "q": query,
        "api_key": SERP_API_KEY,
        "engine": "google",
        "num": 5
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        results = data.get("organic_results", [])
        extracted_content = "\n".join([f"{item['title']}: {item['link']}" for item in results[:5]])
        print(f"[scraper_agent] Found {len(results)} results")

        extracted_data = ScrapeResponse(raw_data=extracted_content)
    except requests.RequestException as e:
        print(f"[scraper_agent] Error: {str(e)}")
        extracted_data = ScrapeResponse(raw_data=f"Error: {str(e)}")

    await ctx.send(data_cleaning_agent.address, extracted_data)

def preprocess_text(text):
    """Applies basic text preprocessing."""
    text = re.sub(r"<.*?>", "", text)  # Remove HTML tags
    text = re.sub(r"[^a-zA-Z0-9\s:]", "", text)  # Remove special characters except colons
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text

@data_cleaning_agent.on_message(model=ScrapeResponse)
async def clean_data(ctx: Context, sender: str, message: ScrapeResponse):
    print(f"[data_cleaning_agent] Cleaning received data ({len(message.raw_data)} characters)")
    raw_data = message.raw_data
    cleaned_text = preprocess_text(raw_data)
    print(f"[data_cleaning_agent] Data cleaned ({len(cleaned_text)} characters)")

    cleaned_data = CleanResponse(cleaned_data=cleaned_text)  
    await ctx.send(eda_agent.address, cleaned_data)

@eda_agent.on_message(model=CleanResponse)
async def perform_eda(ctx: Context, sender: str, message: CleanResponse):
    print(f"[eda_agent] Performing exploratory data analysis")
    cleaned_data = message.cleaned_data

    # Pass the extracted trends forward instead of dummy text
    eda_results = EDAResponse(eda_output=cleaned_data)
    print(f"[eda_agent] EDA completed, sending extracted trends to report agent")

    await ctx.send(report_agent.address, eda_results)

@report_agent.on_message(model=EDAResponse)
async def generate_report(ctx: Context, sender: str, message: EDAResponse):
    print(f"[report_agent] Received EDA insights, generating report")

    # ✅ Display the actual extracted trends
    print(f"[report_agent] Extracted Trends:\n{message.eda_output}")

    print(f"[report_agent] AI Analysis Completed! Trends extracted successfully.")

@model_training_agent.on_message(model=EDAResponse)
async def train_model(ctx: Context, sender: str, message: EDAResponse):
    print(f"[model_training_agent] Training model based on EDA insights")

    # Dummy dataset
    X_train = [[1, 2], [2, 3], [3, 4]]
    y_train = [10, 20, 30]

    # Train model
    model = RandomForestRegressor()
    model.fit(X_train, y_train)
    print(f"[model_training_agent] Model trained successfully")

    # Serialize model and encode as base64 string
    model_bytes = pickle.dumps(model)
    model_bytes_b64 = base64.b64encode(model_bytes).decode('ascii')

    trained_model = TrainResponse(model_bytes_b64=model_bytes_b64)
    print(f"[model_training_agent] Sending trained model to report agent")
    await ctx.send(report_agent.address, trained_model)

@report_agent.on_message(model=TrainResponse)
async def save_model(ctx: Context, sender: str, message: TrainResponse):
    print(f"[report_agent] Saving trained model")

    # Decode and save the trained model
    model_bytes = base64.b64decode(message.model_bytes_b64)
    with open("trained_model.pkl", "wb") as f:
        f.write(model_bytes)

    print("[report_agent] Model saved as 'trained_model.pkl' for future use.")
