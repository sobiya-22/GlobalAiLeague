import re
import pickle
import base64
import requests
import logging
from uagents import Agent, Context
from data_schemas import QueryMessage, ScrapeResponse, CleanResponse, EDAResponse, TrainResponse
from sklearn.ensemble import RandomForestRegressor
import google.generativeai as genai  # Gemini

# Logging
logger = logging.getLogger(__name__)

# API keys
SERP_API_KEY = "3c477edb40b151ad0150967fb244a217279aeb3c168444275988b30eb84ea269"
GOOGLE_API_KEY = "AIzaSyDoM2I7S0CTAxEYxQrIRMID2-z-ccm_VTs"
CX_ID = "94f754d57a90b4778"
GEMINI_API_KEY = "AIzaSyDhZMxtAs2-PzrHQAHmskaa4M2VMBtmPf0"

# Shared memory
analysis_results = {
    "query": "",
    "scrape_results": "",
    "cleaned_data": "",
    "eda_output": "",
    "model_info": "",
    "final_answer": "",
}

# Agents
prompt_agent = Agent(name="prompt_agent")
scraper_agent = Agent(name="scraper_agent")
data_cleaning_agent = Agent(name="data_cleaning_agent")
eda_agent = Agent(name="eda_agent")
model_training_agent = Agent(name="model_training_agent")
report_agent = Agent(name="report_agent")

def setup_ai_tools():
    logger.info("AI tools initialized")
    genai.configure(api_key=GEMINI_API_KEY)

# Text Cleaning
def preprocess_text(text):
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"[^a-zA-Z0-9\s:]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

# Keyword extraction
def extract_keywords(text):
    results = {"Named Entities": {"ORG": [], "LOC": [], "MISC": []}, "Keywords": []}
    words = re.findall(r'\b[A-Z][a-z]+\b', text)
    results["Keywords"] = list(set([w for w in words if len(w) > 3]))[:15]
    orgs = re.findall(r'\b[A-Z][a-zA-Z]* (?:Inc|Corp|Company|Technologies|Ltd)\b', text)
    results["Named Entities"]["ORG"] = list(set(orgs))[:10]
    locs = re.findall(r'(?:in|at|from|to) ([A-Z][a-zA-Z]+)', text)
    results["Named Entities"]["LOC"] = list(set(locs))[:10]
    misc = re.findall(r'\b[A-Z][a-zA-Z]{2,}\b', text)
    results["Named Entities"]["MISC"] = list(set([
        m for m in misc 
        if m not in results["Named Entities"]["ORG"] 
        and m not in results["Named Entities"]["LOC"]
    ]))[:10]
    return results

async def use_serpapi(query):
    try:
        url = "https://serpapi.com/search"
        params = {"q": query, "api_key": SERP_API_KEY, "engine": "google", "num": 10}
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        results = res.json().get("organic_results", [])
        return "\n".join([
            f"Title: {r.get('title')}\nURL: {r.get('link')}\nSnippet: {r.get('snippet')}"
            for r in results
        ])
    except Exception as e:
        logger.error(f"[serpapi] Fallback failed: {e}")
        return "No data"

async def generate_final_answer(query):
    try:
        if not query.strip():
            return "No valid query provided."

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            f"You are an expert assistant. Provide a direct and helpful answer to the user's query: '{query}'"
        )

        if hasattr(response, "text") and response.text.strip():
            return response.text.strip()
        else:
            return "Gemini could not generate a meaningful response."
    except Exception as e:
        logger.error(f"[Gemini] Generation failed: {e}")
        return f"Gemini error: {str(e)}"

# Agent Handlers
@prompt_agent.on_event("startup")
async def start_pipeline(ctx: Context):
    await ctx.send(scraper_agent.address, QueryMessage(query=analysis_results["query"]))

@prompt_agent.on_message(model=QueryMessage)
async def receive_query(ctx: Context, sender: str, message: QueryMessage):
    analysis_results["query"] = message.query

@scraper_agent.on_message(model=QueryMessage)
async def scrape(ctx: Context, sender: str, message: QueryMessage):
    query = message.query
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {"q": query, "key": GOOGLE_API_KEY, "cx": CX_ID, "num": 10}
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        items = res.json().get("items", [])
        result = "\n".join([f"Title: {item.get('title')}\nURL: {item.get('link')}\nSnippet: {item.get('snippet')}" for item in items])
    except Exception as e:
        logger.warning(f"[scraper] Google API failed: {e}")
        result = await use_serpapi(query)

    analysis_results["scrape_results"] = result
    await ctx.send(data_cleaning_agent.address, ScrapeResponse(raw_data=result))

@data_cleaning_agent.on_message(model=ScrapeResponse)
async def clean(ctx: Context, sender: str, message: ScrapeResponse):
    cleaned = preprocess_text(message.raw_data)
    analysis_results["cleaned_data"] = cleaned
    await ctx.send(eda_agent.address, CleanResponse(cleaned_data=cleaned))

@eda_agent.on_message(model=CleanResponse)
async def eda(ctx: Context, sender: str, message: CleanResponse):
    cleaned = message.cleaned_data
    keywords = extract_keywords(cleaned)
    eda_output = f"""
## Exploratory Data Analysis
- Length: {len(cleaned)} chars
- Articles: {cleaned.count('Title:')}
- Keywords: {', '.join(keywords['Keywords'][:5])}
- ORGs: {', '.join(keywords['Named Entities']['ORG'][:5])}
- LOCs: {', '.join(keywords['Named Entities']['LOC'][:5])}
- MISC: {', '.join(keywords['Named Entities']['MISC'][:5])}
- Snippet: {cleaned[:300]}...
"""
    analysis_results["eda_output"] = eda_output
    await ctx.send(report_agent.address, EDAResponse(eda_output=eda_output))
    await ctx.send(model_training_agent.address, EDAResponse(eda_output=eda_output))

@model_training_agent.on_message(model=EDAResponse)
async def train(ctx: Context, sender: str, message: EDAResponse):
    keywords = extract_keywords(message.eda_output)['Keywords']
    X = [[i, len(k)] for i, k in enumerate(keywords)] or [[0, 5], [1, 6]]
    y = [len(k.split()) for k in keywords] or [1, 2]

    model = RandomForestRegressor()
    model.fit(X, y)

    model_bytes = pickle.dumps(model)
    with open("trained_model.pkl", "wb") as f:
        f.write(model_bytes)

    analysis_results["model_info"] = f"RandomForestRegressor trained on {len(X)} samples"
    await ctx.send(report_agent.address, TrainResponse(
        model_bytes_b64=base64.b64encode(model_bytes).decode("utf-8")
    ))

@report_agent.on_message(model=EDAResponse)
async def receive_eda(ctx: Context, sender: str, message: EDAResponse):
    analysis_results["eda_output"] = message.eda_output

@report_agent.on_message(model=TrainResponse)
async def generate_report(ctx: Context, sender: str, message: TrainResponse):
    analysis_results["final_answer"] = await generate_final_answer(analysis_results["query"])

    report = f"""
# Report: {analysis_results["query"]}

## Scrape Stats
- Sources: {analysis_results["scrape_results"].count('Title:')}
- Length: {len(analysis_results["scrape_results"])} chars

## EDA Summary
{analysis_results["eda_output"]}

## Model Summary
{analysis_results["model_info"]}

## Final Answer from Gemini
{analysis_results["final_answer"]}
"""

    print("\n" + "=" * 80 + "\n" + report + "\n" + "=" * 80)
    with open("analysis_results.txt", "w", encoding="utf-8") as f:
        f.write(report)
