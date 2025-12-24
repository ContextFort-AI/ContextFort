from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, JSON, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database URL from environment variable or default to SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./post_monitor.db")

# Handle Vercel Postgres URL format (postgres:// -> postgresql://)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with appropriate connection args
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class BlockedRequest(Base):
    __tablename__ = "blocked_requests"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    target_url = Column(String, index=True)
    target_hostname = Column(String, index=True)
    source_url = Column(String)
    matched_fields = Column(JSON)  # List of matched field names
    matched_values = Column(JSON)  # Dict of field names to values
    request_method = Column(String, default="POST")
    status = Column(String, default="detected")  # detected, blocked, allowed

    # Human/Bot Classification Fields
    is_bot = Column(Boolean, nullable=True, index=True)  # True=bot, False=human, None=unknown
    click_correlation_id = Column(Integer, nullable=True)  # ID from click_detection.db
    click_time_diff_ms = Column(Integer, nullable=True)  # Time between click and request (ms)
    click_coordinates = Column(JSON, nullable=True)  # {x: float, y: float}
    has_click_correlation = Column(Boolean, default=False, index=True)  # Quick filter for correlated requests


class Whitelist(Base):
    __tablename__ = "whitelist"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    hostname = Column(String, index=True)
    added_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)


class ClickEvent(Base):
    """Click detection events table"""
    __tablename__ = "click_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Float, nullable=False, index=True)  # Unix timestamp with milliseconds
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    is_suspicious = Column(Boolean, nullable=False, index=True)
    confidence = Column(Float, nullable=True)
    reason = Column(Text, nullable=True)
    action_type = Column(String, nullable=True)
    action_details = Column(Text, nullable=True)
    page_url = Column(String, nullable=True)
    page_title = Column(String, nullable=True)
    target_tag = Column(String, nullable=True)
    target_id = Column(String, nullable=True)
    target_class = Column(String, nullable=True)
    is_trusted = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
