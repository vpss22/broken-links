import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_ai_client(api_key=None):
    key = api_key or os.getenv("OPENAI_API_KEY")
    if not key:
        return None
    return OpenAI(api_key=key)

def score_lead(lead, use_ai=False, api_key=None, model="gpt-4o-mini"):
    """Score a lead based on various factors, optionally using AI."""
    
    # Base heuristic score (Free/Manual approach)
    score = 0
    if lead.get("instagram_status") == "404":
        score += 4
    if not lead.get("linktree"):
        score += 1
    if lead.get("inactive"):
        score += 2
    if lead.get("subscribers", 0) > 10000:
        score += 1

    tier = "COLD"
    if score >= 6:
        tier = "HOT"
    elif score >= 3:
        tier = "WARM"
    
    ai_analysis = None

    if use_ai:
        client = get_ai_client(api_key)
        if client:
            try:
                prompt = f"""
                Analyze this potential music industry lead:
                Name: {lead.get('name')}
                Instagram Status: {lead.get('instagram_status')}
                Linktree: {lead.get('linktree')}
                Inactive: {lead.get('inactive')}
                Subscribers: {lead.get('subscribers')}
                
                Current Heuristic Score: {score}/8 ({tier})
                
                Provide a brief AI insight (max 20 words) on why this lead might be valuable or a waste of time.
                Also suggest if the score should be adjusted.
                """
                
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": "You are a music industry scout specializing in finding artists with broken marketing funnels."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=50
                )
                ai_analysis = response.choices[0].message.content.strip()
            except Exception as e:
                ai_analysis = f"AI Error: {str(e)}"

    return {
        "score": score,
        "tier": tier,
        "ai_insight": ai_analysis
    }
