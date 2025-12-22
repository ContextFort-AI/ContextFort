from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Create SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./post_monitor.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
