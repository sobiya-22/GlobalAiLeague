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
