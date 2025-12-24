from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from urllib.parse import urlparse
from collections import deque
import database

app = FastAPI(title="Contextfort Security", version="1.0.0")

# Enable CORS for extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Click Detection: Storage for recent OS clicks (for correlation)
os_clicks = deque(maxlen=1000)

# Click Detection Config
TIME_WINDOW_MS = 250
POSITION_TOLERANCE_PX = 20


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


# Click Detection Models
class OSClickEvent(BaseModel):
    x: float
    y: float
    timestamp: float


class DOMClickEvent(BaseModel):
    x: float
    y: float
    timestamp: float
    action_type: Optional[str] = "click"
    action_details: Optional[str] = "{}"
    page_url: Optional[str] = ""
    page_title: Optional[str] = ""
    target_tag: Optional[str] = ""
    target_id: Optional[str] = ""
    target_class: Optional[str] = ""
    is_trusted: Optional[bool] = True


class ClickEventResponse(BaseModel):
    id: int
    timestamp: float
    x: float
    y: float
    is_suspicious: bool
    confidence: Optional[float]
    reason: Optional[str]
    action_type: Optional[str]
    action_details: Optional[str]
    page_url: Optional[str]
    page_title: Optional[str]
    target_tag: Optional[str]
    target_id: Optional[str]
    target_class: Optional[str]
    is_trusted: Optional[bool]
    created_at: datetime

    class Config:
        from_attributes = True


class ClickStatsResponse(BaseModel):
    total_clicks: int
    suspicious_clicks: int
    legitimate_clicks: int
    unique_pages: int
    total_os_clicks: int


class ClickCorrelationResult(BaseModel):
    is_suspicious: bool
    confidence: float
    reason: Optional[str]


class ActionSummary(BaseModel):
    action_type: str
    count: int
    suspicious_count: int


# Initialize database on startup
@app.on_event("startup")
def startup_event():
    database.init_db()


# API Endpoints
@app.get("/")
def read_root():
    return {
        "message": "Contextfort Security - Unified Backend",
        "version": "2.0.0",
        "endpoints": {
            "POST /api/blocked-requests": "Store a blocked request",
            "GET /api/blocked-requests": "Get all suspicious requests",
            "GET /api/blocked-requests/human": "Get human POST requests with user input (on button click)",
            "GET /api/blocked-requests/human/background": "Get human background requests",
            "GET /api/blocked-requests/bot": "Get bot-initiated requests",
            "GET /api/stats": "Get statistics",
            "GET /api/stats/classification": "Get human/bot classification stats",
            "DELETE /api/blocked-requests/{id}": "Delete a request",
            "DELETE /api/blocked-requests": "Clear all requests",
            "POST /api/whitelist": "Add a URL to whitelist",
            "GET /api/whitelist": "Get all whitelisted URLs",
            "GET /api/whitelist/check": "Check if a URL is whitelisted",
            "DELETE /api/whitelist/{id}": "Remove a URL from whitelist",
            "GET /api/click-detection/health": "Click detection health check",
            "GET /api/click-detection/stats": "Get click detection statistics",
            "GET /api/click-detection/suspicious": "Get suspicious clicks",
            "GET /api/click-detection/recent": "Get recent clicks",
            "GET /api/click-detection/actions": "Get action summary",
            "POST /api/click-detection/events/os": "Record OS click",
            "POST /api/click-detection/events/dom": "Record DOM click"
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
    """Get all blocked requests with optional filtering - only suspicious requests"""
    query = db.query(database.BlockedRequest)

    if hostname:
        query = query.filter(database.BlockedRequest.target_hostname == hostname)

    # Filter to get all requests first
    all_requests = query.order_by(database.BlockedRequest.timestamp.desc()).all()

    # Filter for suspicious requests only:
    # 1. Must have matched_fields and matched_values (not empty)
    # 2. Must be suspicious: NOT (is_bot=False AND has_click_correlation=True)
    #    i.e., either is_bot=True OR is_bot=None OR has_click_correlation=False
    filtered_requests = [
        req for req in all_requests
        if req.matched_fields and len(req.matched_fields) > 0
        and req.matched_values and len(req.matched_values) > 0
        and not (req.is_bot == False and req.has_click_correlation == True)
    ]

    # Apply pagination to filtered results
    paginated_requests = filtered_requests[skip:skip + limit]
    return paginated_requests


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
    """Get human-initiated POST requests with user input data (on button click)"""
    all_requests = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.is_bot == False,
        database.BlockedRequest.has_click_correlation == True
    ).order_by(database.BlockedRequest.timestamp.desc()).all()

    # Filter for requests with matched_fields and matched_values
    filtered_requests = [
        req for req in all_requests
        if req.matched_fields and len(req.matched_fields) > 0
        and req.matched_values and len(req.matched_values) > 0
    ]

    paginated_requests = filtered_requests[skip:skip + limit]
    return paginated_requests


@app.get("/api/blocked-requests/human/background", response_model=List[BlockedRequestResponse])
def get_human_background_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """Get human background requests (is_bot=False with no user input data)"""
    all_requests = db.query(database.BlockedRequest).filter(
        database.BlockedRequest.is_bot == False
    ).order_by(database.BlockedRequest.timestamp.desc()).all()

    # Filter for requests with NO matched_fields or matched_values (background activity)
    background_requests = [
        req for req in all_requests
        if (not req.matched_fields or len(req.matched_fields) == 0)
        or (not req.matched_values or len(req.matched_values) == 0)
    ]

    # Apply pagination
    paginated_requests = background_requests[skip:skip + limit]
    return paginated_requests


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


# ==================== CLICK DETECTION ENDPOINTS ====================

def correlate_click(dom_click: dict) -> ClickCorrelationResult:
    """Check if DOM click matches any recent OS click"""
    time_window_sec = TIME_WINDOW_MS / 1000.0

    if not os_clicks:
        return ClickCorrelationResult(
            is_suspicious=True,
            confidence=0.9,
            reason="No OS clicks recorded"
        )

    for os_click in reversed(os_clicks):
        time_diff = abs(dom_click['timestamp'] - os_click['timestamp'])

        if time_diff > time_window_sec:
            break

        return ClickCorrelationResult(
            is_suspicious=False,
            confidence=1.0,
            reason=None
        )

    return ClickCorrelationResult(
        is_suspicious=True,
        confidence=0.9,
        reason=f"No OS click within {TIME_WINDOW_MS}ms"
    )


@app.get("/api/click-detection/health")
def click_detection_health():
    """Health check for click detection"""
    return {"status": "ok", "version": "2.0.0 (integrated)"}


@app.get("/api/click-detection/stats", response_model=ClickStatsResponse)
def get_click_stats(db: Session = Depends(database.get_db)):
    """Get click detection statistics"""
    from sqlalchemy import func

    total = db.query(database.ClickEvent).count()
    suspicious = db.query(database.ClickEvent).filter(
        database.ClickEvent.is_suspicious == True
    ).count()
    legitimate = db.query(database.ClickEvent).filter(
        database.ClickEvent.is_suspicious == False
    ).count()
    unique_pages = db.query(func.count(func.distinct(database.ClickEvent.page_url))).scalar()

    return {
        "total_clicks": total,
        "suspicious_clicks": suspicious,
        "legitimate_clicks": legitimate,
        "unique_pages": unique_pages,
        "total_os_clicks": len(os_clicks)
    }


@app.get("/api/click-detection/suspicious", response_model=List[ClickEventResponse])
def get_suspicious_clicks(
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """Get suspicious clicks"""
    clicks = db.query(database.ClickEvent).filter(
        database.ClickEvent.is_suspicious == True
    ).order_by(database.ClickEvent.created_at.desc()).limit(limit).all()
    return clicks


@app.get("/api/click-detection/recent", response_model=List[ClickEventResponse])
def get_recent_clicks(
    limit: int = 50,
    db: Session = Depends(database.get_db)
):
    """Get recent clicks"""
    clicks = db.query(database.ClickEvent).order_by(
        database.ClickEvent.created_at.desc()
    ).limit(limit).all()
    return clicks


@app.get("/api/click-detection/actions", response_model=List[ActionSummary])
def get_action_summary(db: Session = Depends(database.get_db)):
    """Get action summary"""
    from sqlalchemy import func, case

    results = db.query(
        database.ClickEvent.action_type,
        func.count(database.ClickEvent.id).label('count'),
        func.sum(
            case((database.ClickEvent.is_suspicious == True, 1), else_=0)
        ).label('suspicious_count')
    ).group_by(database.ClickEvent.action_type).all()

    return [
        {
            "action_type": row[0],
            "count": row[1],
            "suspicious_count": row[2]
        }
        for row in results
    ]


@app.post("/api/click-detection/events/os")
def record_os_click(event: OSClickEvent):
    """Record an OS click event"""
    click = {
        'source': 'os',
        'x': event.x,
        'y': event.y,
        'timestamp': event.timestamp
    }
    os_clicks.append(click)
    print(f"[Click Detection] OS click recorded: x={click['x']:.1f}, y={click['y']:.1f}, time={click['timestamp']:.3f}")
    return {"success": True}


@app.post("/api/click-detection/events/dom", response_model=ClickCorrelationResult)
def record_dom_click(
    event: DOMClickEvent,
    db: Session = Depends(database.get_db)
):
    """Record a DOM click event and correlate with OS clicks"""
    click = {
        'x': event.x,
        'y': event.y,
        'timestamp': event.timestamp
    }

    # Correlate with OS clicks
    result = correlate_click(click)

    # Store in database
    db_click = database.ClickEvent(
        timestamp=event.timestamp,
        x=event.x,
        y=event.y,
        is_suspicious=result.is_suspicious,
        confidence=result.confidence,
        reason=result.reason,
        action_type=event.action_type,
        action_details=event.action_details,
        page_url=event.page_url,
        page_title=event.page_title,
        target_tag=event.target_tag,
        target_id=event.target_id,
        target_class=event.target_class,
        is_trusted=event.is_trusted
    )
    db.add(db_click)
    db.commit()
    db.refresh(db_click)

    if result.is_suspicious:
        print(f"[Click Detection] ⚠️  SUSPICIOUS {event.action_type}: {event.page_title} - {result.reason}")
    else:
        print(f"[Click Detection] ✓ Legitimate {event.action_type}: {event.page_title}")

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
