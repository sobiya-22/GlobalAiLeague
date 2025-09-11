from uagents import Model

class QueryMessage(Model):
    query: str

class ScrapeResponse(Model):
    raw_data: str

class CleanResponse(Model):
    cleaned_data: str

class EDAResponse(Model):
    eda_output: str

class TrainResponse(Model):
    model_bytes_b64: str
