#!/usr/bin/env python3
"""
Click Detection SDK Server with SQLite Database
Stores all click events and actions with detailed analytics
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
from collections import deque
from datetime import datetime
import os
from urllib.parse import urlparse, parse_qs

# Storage for recent clicks (for correlation)
os_clicks = deque(maxlen=1000)

# Config
TIME_WINDOW_MS = 250
POSITION_TOLERANCE_PX = 20
DB_PATH = 'click_detection.db'

# Initialize database
def init_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create clicks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL NOT NULL,
            x REAL NOT NULL,
            y REAL NOT NULL,
            is_suspicious BOOLEAN NOT NULL,
            confidence REAL,
            reason TEXT,
            action_type TEXT,
            action_details TEXT,
            page_url TEXT,
            page_title TEXT,
            target_tag TEXT,
            target_id TEXT,
            target_class TEXT,
            is_trusted BOOLEAN,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create index for faster queries
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON clicks(timestamp DESC)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_suspicious ON clicks(is_suspicious)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_created_at ON clicks(created_at DESC)')

    conn.commit()
    conn.close()
    print('✓ Database initialized')

class ClickDetectionHandler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        # Parse URL and query parameters
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query_params = parse_qs(parsed_url.query)

        if path == '/':
            # Serve dashboard
            self.serve_dashboard()

        elif path == '/api/health':
            self.send_json(200, {'status': 'ok', 'version': '0.2.0'})

        elif path == '/api/stats':
            self.send_json(200, self.get_stats())

        elif path == '/api/suspicious':
            limit = int(query_params.get('limit', [100])[0])
            self.send_json(200, self.get_suspicious_clicks(limit))

        elif path == '/api/recent':
            limit = int(query_params.get('limit', [50])[0])
            self.send_json(200, self.get_recent_clicks(limit))

        elif path == '/api/actions':
            self.send_json(200, self.get_action_summary())

        else:
            self.send_response(404)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        data = json.loads(body)

        if self.path == '/api/events/os':
            self.record_os_click(data)
            self.send_json(200, {'success': True})

        elif self.path == '/api/events/dom':
            result = self.record_dom_click(data)
            self.send_json(200, result)

        else:
            self.send_response(404)
            self.end_headers()

    def record_os_click(self, data):
        click = {
            'source': 'os',
            'x': data['x'],
            'y': data['y'],
            'timestamp': data['timestamp']
        }
        os_clicks.append(click)
        print(f"[SDK] OS click recorded: x={click['x']:.1f}, y={click['y']:.1f}, time={click['timestamp']:.3f}")

    def record_dom_click(self, data):
        click = {
            'x': data['x'],
            'y': data['y'],
            'timestamp': data['timestamp']
        }

        # Correlate with OS clicks
        result = self.correlate(click)

        # Store in database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO clicks (
                timestamp, x, y, is_suspicious, confidence, reason,
                action_type, action_details, page_url, page_title,
                target_tag, target_id, target_class, is_trusted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['timestamp'],
            data['x'],
            data['y'],
            result['is_suspicious'],
            result['confidence'],
            result['reason'],
            data.get('action_type', 'click'),
            data.get('action_details', '{}'),
            data.get('page_url', ''),
            data.get('page_title', ''),
            data.get('target_tag', ''),
            data.get('target_id', ''),
            data.get('target_class', ''),
            data.get('is_trusted', True)
        ))

        conn.commit()
        conn.close()

        if result['is_suspicious']:
            print(f"[SDK] ⚠️  SUSPICIOUS {data.get('action_type', 'click')}: {data.get('page_title', '')} - {result['reason']}")
        else:
            print(f"[SDK] ✓ Legitimate {data.get('action_type', 'click')}: {data.get('page_title', '')}")

        return result

    def correlate(self, dom_click):
        """Check if DOM click matches any recent OS click"""
        time_window_sec = TIME_WINDOW_MS / 1000.0

        if not os_clicks:
            return {
                'is_suspicious': True,
                'confidence': 0.9,
                'reason': 'No OS clicks recorded'
            }

        for os_click in reversed(os_clicks):
            time_diff = abs(dom_click['timestamp'] - os_click['timestamp'])

            if time_diff > time_window_sec:
                break

            return {
                'is_suspicious': False,
                'confidence': 1.0,
                'reason': None
            }

        return {
            'is_suspicious': True,
            'confidence': 0.9,
            'reason': f'No OS click within {TIME_WINDOW_MS}ms'
        }

    def get_stats(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM clicks')
        total = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM clicks WHERE is_suspicious = 1')
        suspicious = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM clicks WHERE is_suspicious = 0')
        legitimate = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(DISTINCT page_url) FROM clicks')
        unique_pages = cursor.fetchone()[0]

        conn.close()

        return {
            'total_clicks': total,
            'suspicious_clicks': suspicious,
            'legitimate_clicks': legitimate,
            'unique_pages': unique_pages,
            'total_os_clicks': len(os_clicks)
        }

    def get_suspicious_clicks(self, limit=100):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM clicks
            WHERE is_suspicious = 1
            ORDER BY created_at DESC
            LIMIT ?
        ''', (limit,))

        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    def get_recent_clicks(self, limit=50):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM clicks
            ORDER BY created_at DESC
            LIMIT ?
        ''', (limit,))

        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    def get_action_summary(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT action_type, COUNT(*) as count,
                   SUM(CASE WHEN is_suspicious = 1 THEN 1 ELSE 0 END) as suspicious_count
            FROM clicks
            GROUP BY action_type
        ''')

        rows = cursor.fetchall()
        conn.close()

        return [{'action_type': row[0], 'count': row[1], 'suspicious_count': row[2]} for row in rows]

    def serve_dashboard(self):
        """Serve the HTML dashboard"""
        dashboard_path = 'dashboard.html'
        if os.path.exists(dashboard_path):
            with open(dashboard_path, 'r') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(content.encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Dashboard not found. Please create dashboard.html')

    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        pass

def main():
    port = 9999

    print('🔍 Click Detection SDK v0.2.0 (Python + SQLite)')
    print('=' * 50)
    print()

    # Initialize database
    init_database()

    server = HTTPServer(('127.0.0.1', port), ClickDetectionHandler)

    print(f'🚀 API server listening on http://127.0.0.1:{port}')
    print(f'📊 Dashboard available at http://127.0.0.1:{port}/')
    print(f'💾 Database: {DB_PATH}')
    print()
    print('API Endpoints:')
    print('  GET  /                 - Dashboard')
    print('  GET  /api/health       - Health check')
    print('  GET  /api/stats        - Get statistics')
    print('  GET  /api/suspicious   - Get suspicious clicks')
    print('  GET  /api/recent       - Get recent clicks')
    print('  GET  /api/actions      - Get action summary')
    print('  POST /api/events/os    - Record OS click')
    print('  POST /api/events/dom   - Record DOM click')
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n\n👋 Server stopped')
        server.shutdown()

if __name__ == '__main__':
    main()
