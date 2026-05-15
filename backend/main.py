from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraper import scan_leads
from ai import score_lead
import os

app = FastAPI(title="Music Funnel AI API")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    """Health check endpoint."""
    return {"status": "running", "service": "Music Funnel AI API"}


@app.get("/scan")
def scan():
    """Scan for leads and score them."""
    leads = scan_leads()

    results = []
    for lead in leads:
        lead["score"] = score_lead(lead)
        results.append(lead)

    return results


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
