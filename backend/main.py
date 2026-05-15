from fastapi import FastAPI, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from scraper import scan_leads
from ai import score_lead
import os
from typing import Optional

app = FastAPI(title="Music Funnel AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "running", "service": "Music Funnel AI API"}

@app.get("/scan")
def scan(
    mode: str = Query("manual", enum=["manual", "ai"]),
    model: str = Query("gpt-4o-mini"),
    api_key: Optional[str] = Header(None, alias="X-API-Key")
):
    """Scan for leads and score them using selected mode."""
    leads = scan_leads()
    
    use_ai = mode == "ai"
    results = []
    
    for lead in leads:
        lead["score"] = score_lead(
            lead, 
            use_ai=use_ai, 
            api_key=api_key, 
            model=model
        )
        results.append(lead)

    return results

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
