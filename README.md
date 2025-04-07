

# 🌐 Global AI League — Multi-Agent AI Pipeline for Intelligent Insight ⚙️🧠

> **Agentic Workflow Completed**  
> ✅ This is the completed implementation of a multi-agent system built with Fetch.ai's uAgents. Fully functional end-to-end AI pipeline.

🔗 **GitHub Repo**: [https://github.com/SarthSatpute/GlobalAiLeague](https://github.com/SarthSatpute/GlobalAiLeague)

---

## 🧠 About the Project

**Global AI League** is a multi-agent system that simulates a decentralized team of AI agents working in sync to answer complex queries. Each agent handles a unique task — from scraping and cleaning data to performing exploratory analysis and generating a final Gemini-powered response.

This project showcases the power of modular, distributed AI workflows using the [uAgents framework](https://docs.fetch.ai/uAgents/) by Fetch.ai, enhanced with Gemini’s natural language reasoning.

---

## ✨ Key Features

- 🔍 Real-time web scraping using Google API & SerpAPI fallback
- 🧹 Intelligent text preprocessing & deduplication
- 📊 Exploratory Data Analysis: keyword/entity extraction
- 🤖 Lightweight ML model (RandomForest) for trend discovery
- 💬 Gemini-based smart assistant final response
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
