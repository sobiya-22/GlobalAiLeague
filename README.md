# 🌐 Global AI League – Multi-Agent AI Workflow

Welcome to the **Global AI League** repository! This project demonstrates a powerful multi-agent AI workflow built using the [uAgents framework](https://docs.fetch.ai/uAgents/) by Fetch.ai. The goal is to simulate a decentralized team of AI agents that collaboratively scrape information, analyze it, and generate a smart, chatbot-style answer powered by Gemini.


## 🧠 Agentic Architecture

The project runs on six fully decoupled agents, each with a clear responsibility:

```bash
User Input → Prompt Agent
            ↓
       Scraper Agent (Google API + SerpAPI fallback)
            ↓
     Cleaning Agent (Text preprocessing)
            ↓
        EDA Agent (Keyword/entity extraction)
            ↓
    Model Training Agent (Dummy ML for insight)
            ↓
       Report Agent (Final Gemini-based Answer)

Each agent communicates independently using Pydantic-based message schemas over uAgents.

---

## 📦 Tech Stack

| Component        | Tool/Library                    |
|------------------|----------------------------------|
| Agent Framework  | `uAgents` (Fetch.ai)            |
| Scraping         | Google Custom Search, SerpAPI   |
| NLP & EDA        | Regex, Entity Extraction        |
| ML Model         | Scikit-learn (RandomForest)     |
| AI Completion    | Gemini API (Google AI)          |
| Language         | Python 3.10+                    |

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/SarthSatpute/GlobalAiLeague.git
cd GlobalAiLeague

# Install dependencies
pip install -r requirements.txt

# Run the system
python main.py
