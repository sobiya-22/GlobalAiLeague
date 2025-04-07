

# 🌐 Global AI League — Multi-Agent AI Pipeline for Intelligent Insight ⚙️🧠

> **Agentic Workflow Completed**  
> ✅ This is the completed implementation of a multi-agent system built with Fetch.ai's uAgents. Fully functional end-to-end AI pipeline.

🔗 **GitHub Repo**: [https://github.com/SarthSatpute/GlobalAiLeague](https://github.com/SarthSatpute/GlobalAiLeague)

---

## 🧠 About the Project

**Global AI League** This project is an intelligent multi-agent system designed to automate the entire data analysis pipeline using the uAgents framework by Fetch.ai. At its core, the system features a network of lightweight agents—each dedicated to a specific task like prompting, scraping, cleaning, exploring, modeling, and reporting. It simulates a collaborative workflow where AI agents communicate asynchronously to transform a raw query into structured data insights.

This project showcases the power of modular, distributed AI workflows using the [uAgents framework](https://docs.fetch.ai/uAgents/) by Fetch.ai. This architecture not only demonstrates modular AI collaboration but also aligns with decentralized agent-based design principles. It mimics how specialized team members would work together—except here, it's fully automated and extensible.

---

## ✨ Key Features

- 🔍 Real-time web scraping using Google API & SerpAPI fallback
- 🧹 Intelligent text preprocessing & deduplication
- 📊 Exploratory Data Analysis: keyword/entity extraction
- 🤖 Lightweight ML model (RandomForest) for trend discovery
- 🧩 Fully modular, decoupled architecture with 6 specialized agents

---

## 🤖 Agent Workflow Architecture

```bash
User Query
   ↓
Prompt Agent
   ↓
Scraper Agent (Google Search + SerpAPI fallback)
   ↓
Cleaning Agent (Text Preprocessing)
   ↓
EDA Agent (Keyword & Entity Extraction)
   ↓
Model Training Agent (RandomForest Insight)
   ↓
Report Agent 
```

---

## 🚀 Tech Stack

- ⚙️ **Framework**: Fetch.ai’s `uAgents`
- 🌐 **Scraping**: `requests`, Google Programmable Search API, SerpAPI
- 🧼 **Text Cleaning**: `pandas`, `re`, `nltk`
- 📊 **ML Model**: `scikit-learn` (RandomForestRegressor)
- 💬 **LLM**: Google Gemini API (generativelanguage.googleapis.com)
- 🔐 **Secrets**: `.env` with `python-dotenv`

---

## 🛠 Getting Started (Dev Mode)

```bash
git clone https://github.com/SarthSatpute/GlobalAiLeague.git
cd GlobalAiLeague
pip install -r requirements.txt
python main.py
```

> ✅ Don’t forget to create a `.env` file with:
> - `GOOGLE_API_KEY`
> - `SEARCH_ENGINE_ID`
> - `SERP_API_KEY`
> - `GEMINI_API_KEY`

---



## 🌱 What's Coming Next

- 📊 Agent monitoring & analytics dashboard (React)
- 🧠 Context retention and memory in agents
- ☁️ Cloud deployment (Docker + uAgents node)
```
