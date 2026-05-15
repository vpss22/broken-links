def score_lead(lead):
    """Score a lead based on various factors."""
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

    return {
        "score": score,
        "tier": tier
    }
