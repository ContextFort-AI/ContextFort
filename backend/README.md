# POST Monitor Backend

FastAPI server with SQLite database for storing and managing detected POST requests.

## Quick Start

```bash
./start.sh
```

This will:
1. Create a virtual environment (if needed)
2. Install dependencies
3. Start the server on http://127.0.0.1:8000

## Manual Setup

If the start script doesn't work:

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

## API Documentation

Once the server is running, visit:
- **Interactive docs**: http://127.0.0.1:8000/docs
- **Alternative docs**: http://127.0.0.1:8000/redoc
- **API root**: http://127.0.0.1:8000

## Database

The SQLite database (`post_monitor.db`) is created automatically on first run.

### Schema

**Table: blocked_requests**
- `id`: Integer (Primary Key)
- `timestamp`: DateTime
- `target_url`: String (URL that was targeted)
- `target_hostname`: String (e.g., "example.com")
- `source_url`: String (Page where detection occurred)
- `matched_fields`: JSON (List of field names like ["email", "password"])
- `matched_values`: JSON (Dict of field values)
- `request_method`: String (Usually "POST")
- `status`: String ("detected", "blocked", "allowed")

### Reset Database

If you need to start fresh:

```bash
rm post_monitor.db
python main.py  # Will create new database
```

## Configuration

### Change Port

Edit `main.py`:
```python
uvicorn.run(app, host="127.0.0.1", port=8000)  # Change port here
```

### Database Location

Edit `database.py`:
```python
SQLALCHEMY_DATABASE_URL = "sqlite:///./post_monitor.db"  # Change path
```

### CORS Settings

Edit `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production!
    ...
)
```

## Development

### Run with auto-reload

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Check logs

Server logs appear in the terminal. Look for:
- Request logs (POST, GET, DELETE)
- Error messages
- Database operations

### Test endpoints

```bash
# Get stats
curl http://127.0.0.1:8000/api/stats

# Get all requests
curl http://127.0.0.1:8000/api/blocked-requests

# Add a test request
curl -X POST http://127.0.0.1:8000/api/blocked-requests \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://example.com",
    "target_hostname": "example.com",
    "source_url": "https://test.com",
    "matched_fields": ["email"],
    "matched_values": {"email": "test@example.com"}
  }'
```

## Dependencies

- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation

## Production Deployment

For production use:

1. Use a production server (Gunicorn + Uvicorn workers)
2. Configure proper CORS origins
3. Add authentication
4. Use environment variables
5. Set up SSL/HTTPS
6. Configure logging
7. Set up database backups
8. Monitor server health

Example production command:
```bash
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```
