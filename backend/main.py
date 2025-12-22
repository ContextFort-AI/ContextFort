from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from urllib.parse import urlparse
import database

app = FastAPI(title="POST Monitor API", version="1.0.0")

# Enable CORS for extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class BlockedRequestCreate(BaseModel):
    target_url: str
    target_hostname: str
    source_url: str
    matched_fields: List[str]
    matched_values: Dict[str, str]
    request_method: str = "POST"
    status: str = "detected"

    # Human/Bot Classification Fields
    is_bot: Optional[bool] = None
    click_correlation_id: Optional[int] = None
    click_time_diff_ms: Optional[int] = None
    click_coordinates: Optional[Dict[str, float]] = None
    has_click_correlation: bool = False


class BlockedRequestResponse(BaseModel):
    id: int
    timestamp: datetime
    target_url: str
    target_hostname: str
    source_url: str
    matched_fields: List[str]
    matched_values: Dict[str, str]
    request_method: str
    status: str

    # Human/Bot Classification Fields
    is_bot: Optional[bool] = None
    click_correlation_id: Optional[int] = None
    click_time_diff_ms: Optional[int] = None
    click_coordinates: Optional[Dict[str, float]] = None
    has_click_correlation: bool = False

    class Config:
        from_attributes = True


class BlockedDomain(BaseModel):
    hostname: str
    count: int


class RecentActivity(BaseModel):
    date: str
    count: int


class StatsResponse(BaseModel):
    total_requests: int
    today_requests: int
    blocked_domains: List[BlockedDomain]
    recent_activity: List[RecentActivity]


class ClassificationStatsResponse(BaseModel):
    total_requests: int
    human_requests: int
    bot_requests: int
    uncorrelated_requests: int
    correlation_rate: float


class WhitelistCreate(BaseModel):
    url: str
    notes: Optional[str] = None


class WhitelistResponse(BaseModel):
    id: int
    url: str
    hostname: str
    added_at: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True


# Initialize database on startup
@app.on_event("startup")
def startup_event():
    database.init_db()


# API Endpoints
@app.get("/")
def read_root():
    return {
        "message": "POST Monitor API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/blocked-requests": "Store a blocked request",
            "GET /api/blocked-requests": "Get all blocked requests",
            "GET /api/stats": "Get statistics",
            "DELETE /api/blocked-requests/{id}": "Delete a request",
            "DELETE /api/blocked-requests": "Clear all requests",
            "POST /api/whitelist": "Add a URL to whitelist",
            "GET /api/whitelist": "Get all whitelisted URLs",
            "GET /api/whitelist/check": "Check if a URL is whitelisted",
            "DELETE /api/whitelist/{id}": "Remove a URL from whitelist"
        }
    }


@app.post("/api/blocked-requests", response_model=BlockedRequestResponse)
def create_blocked_request(
    request: BlockedRequestCreate,
    db: Session = Depends(database.get_db)
):
    """Store a new blocked request"""
    db_request = database.BlockedRequest(
        target_url=request.target_url,
        target_hostname=request.target_hostname,
        source_url=request.source_url,
        matched_fields=request.matched_fields,
        matched_values=request.matched_values,
        request_method=request.request_method,
        status=request.status,
        # Human/Bot Classification
        is_bot=request.is_bot,
        click_correlation_id=request.click_correlation_id,
        click_time_diff_ms=request.click_time_diff_ms,
        click_coordinates=request.click_coordinates,
        has_click_correlation=request.has_click_correlation
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@app.get("/api/blocked-requests", response_model=List[BlockedRequestResponse])
def get_blocked_requests(
    skip: int = 0,
    limit: int = 100,
    hostname: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    """Get all blocked requests with optional filtering"""
    query = db.query(database.BlockedRequest)

    if hostname:
        query = query.filter(database.BlockedRequest.target_hostname == hostname)

    requests = query.order_by(database.BlockedRequest.timestamp.desc()).offset(skip).limit(limit).all()
    return requests


@app.get("/api/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(database.get_db)):
    """Get statistics about blocked requests"""
    # Total requests
    total = db.query(database.BlockedRequest).count()

    # Today's requests
    today = datetime.utcnow().date()
    today_count = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.timestamp >= datetime.combine(today, datetime.min.time())
    ).count()

    # Top blocked domains
    from sqlalchemy import func
    domain_stats = db.query(
        database.BlockedRequest.target_hostname,
        func.count(database.BlockedRequest.id).label('count')
    ).group_by(
        database.BlockedRequest.target_hostname
    ).order_by(
        func.count(database.BlockedRequest.id).desc()
    ).limit(10).all()

    blocked_domains = [{"hostname": host, "count": count} for host, count in domain_stats]

    # Recent activity (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    daily_stats = db.query(
        func.date(database.BlockedRequest.timestamp).label('date'),
        func.count(database.BlockedRequest.id).label('count')
    ).filter(
        database.BlockedRequest.timestamp >= seven_days_ago
    ).group_by(
        func.date(database.BlockedRequest.timestamp)
    ).order_by('date').all()

    recent_activity = [{"date": str(date), "count": count} for date, count in daily_stats]

    return {
        "total_requests": total,
        "today_requests": today_count,
        "blocked_domains": blocked_domains,
        "recent_activity": recent_activity
    }


@app.delete("/api/blocked-requests/{request_id}")
def delete_blocked_request(request_id: int, db: Session = Depends(database.get_db)):
    """Delete a specific blocked request"""
    request = db.query(database.BlockedRequest).filter(database.BlockedRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    db.delete(request)
    db.commit()
    return {"message": "Request deleted successfully"}


@app.delete("/api/blocked-requests")
def clear_all_requests(db: Session = Depends(database.get_db)):
    """Clear all blocked requests"""
    count = db.query(database.BlockedRequest).delete()
    db.commit()
    return {"message": f"Deleted {count} requests"}


# Human/Bot Classification Endpoints
@app.get("/api/blocked-requests/human", response_model=List[BlockedRequestResponse])
def get_human_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """Get only human-initiated requests (is_bot=False)"""
    requests = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.is_bot == False,
        database.BlockedRequest.has_click_correlation == True
    ).order_by(database.BlockedRequest.timestamp.desc()).offset(skip).limit(limit).all()
    return requests


@app.get("/api/blocked-requests/bot", response_model=List[BlockedRequestResponse])
def get_bot_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """Get only bot-initiated requests (is_bot=True)"""
    requests = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.is_bot == True
    ).order_by(database.BlockedRequest.timestamp.desc()).offset(skip).limit(limit).all()
    return requests


@app.get("/api/stats/classification", response_model=ClassificationStatsResponse)
def get_classification_stats(db: Session = Depends(database.get_db)):
    """Get human/bot classification statistics"""
    total_count = db.query(database.BlockedRequest).count()
    human_count = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.is_bot == False
    ).count()
    bot_count = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.is_bot == True
    ).count()
    uncorrelated_count = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.has_click_correlation == False
    ).count()

    correlation_rate = ((human_count + bot_count) / total_count * 100) if total_count > 0 else 0.0

    return {
        "total_requests": total_count,
        "human_requests": human_count,
        "bot_requests": bot_count,
        "uncorrelated_requests": uncorrelated_count,
        "correlation_rate": correlation_rate
    }


# Whitelist endpoints
@app.post("/api/whitelist", response_model=WhitelistResponse)
def add_to_whitelist(
    whitelist_item: WhitelistCreate,
    db: Session = Depends(database.get_db)
):
    """Add a URL to the whitelist"""
    # Parse URL to extract hostname
    parsed = urlparse(whitelist_item.url)
    hostname = parsed.netloc or parsed.path

    # Check if URL already exists
    existing = db.query(database.Whitelist).filter(
        database.Whitelist.url == whitelist_item.url
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="URL already whitelisted")

    # Create new whitelist entry
    db_whitelist = database.Whitelist(
        url=whitelist_item.url,
        hostname=hostname,
        notes=whitelist_item.notes
    )
    db.add(db_whitelist)
    db.commit()
    db.refresh(db_whitelist)
    return db_whitelist


@app.get("/api/whitelist", response_model=List[WhitelistResponse])
def get_whitelist(db: Session = Depends(database.get_db)):
    """Get all whitelisted URLs"""
    whitelist = db.query(database.Whitelist).order_by(database.Whitelist.added_at.desc()).all()
    return whitelist


@app.get("/api/whitelist/check")
def check_whitelist(url: str, db: Session = Depends(database.get_db)):
    """Check if a URL is whitelisted"""
    parsed = urlparse(url)
    hostname = parsed.netloc or parsed.path

    # Check exact URL match
    exact_match = db.query(database.Whitelist).filter(
        database.Whitelist.url == url
    ).first()

    if exact_match:
        return {"whitelisted": True, "match_type": "exact"}

    # Check hostname match
    hostname_match = db.query(database.Whitelist).filter(
        database.Whitelist.hostname == hostname
    ).first()

    if hostname_match:
        return {"whitelisted": True, "match_type": "hostname"}

    return {"whitelisted": False}


@app.delete("/api/whitelist/{whitelist_id}")
def delete_from_whitelist(whitelist_id: int, db: Session = Depends(database.get_db)):
    """Remove a URL from the whitelist"""
    whitelist_item = db.query(database.Whitelist).filter(
        database.Whitelist.id == whitelist_id
    ).first()

    if not whitelist_item:
        raise HTTPException(status_code=404, detail="Whitelist entry not found")

    db.delete(whitelist_item)
    db.commit()
    return {"message": "Removed from whitelist successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
