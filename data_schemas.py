from uagents import Model
import base64

# Query message to start the process
class QueryMessage(Model):
    query: str

# Scraper response
class ScrapeResponse(Model):
    raw_data: str

# Data Cleaning messages
class CleanResponse(Model):
    cleaned_data: str

# EDA messages
class EDAResponse(Model):
    eda_output: str

# Model Training messages - Changed to use base64 encoding for binary data
class TrainResponse(Model):
    model_bytes_b64: str  # Base64 encoded serialized model