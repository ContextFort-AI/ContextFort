#!/usr/bin/env python3
"""
Simple HTTP server for testing click detection without Rust
Runs the correlation engine in Python
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import time
from collections import deque
from datetime import datetime
import math

# Storage
os_clicks = deque(maxlen=1000)
dom_clicks = deque(maxlen=1000)
suspicious_clicks = []

# Config
TIME_WINDOW_MS = 250  # Increased to 250ms to account for browser processing delay
POSITION_TOLERANCE_PX = 20

class ClickDetectionHandler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Click Detection SDK API v0.1.0 (Python)\n')

        elif self.path == '/api/health':
            self.send_json(200, {'status': 'ok', 'version': '0.1.0'})

        elif self.path == '/api/stats':
            stats = {
                'total_os_clicks': len(os_clicks),
                'total_dom_clicks': len(dom_clicks),
                'suspicious_clicks': len(suspicious_clicks)
            }
            self.send_json(200, stats)

        elif self.path == '/api/suspicious':
            self.send_json(200, list(suspicious_clicks))

        else:
            self.send_response(404)
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
            'source': 'dom',
            'x': data['x'],
            'y': data['y'],
            'timestamp': data['timestamp']
        }
        dom_clicks.append(click)

        # Correlate with OS clicks
        result = self.correlate(click)

        if result['is_suspicious']:
            suspicious_clicks.append({
                'click': click,
                'reason': result['reason'],
                'time': datetime.now().isoformat()
            })
            print(f"[SDK] ⚠️  SUSPICIOUS DOM click: x={click['x']:.1f}, y={click['y']:.1f}, reason={result['reason']}")
        else:
            print(f"[SDK] ✓ Legitimate DOM click: x={click['x']:.1f}, y={click['y']:.1f}")

        return result

    def correlate(self, dom_click):
        """Check if DOM click matches any recent OS click - SIMPLIFIED VERSION"""
        time_window_sec = TIME_WINDOW_MS / 1000.0

        if not os_clicks:
            return {
                'is_suspicious': True,
                'confidence': 0.9,
                'reason': 'No OS clicks recorded'
            }

        # Search recent OS clicks - IGNORE POSITION, ONLY CHECK TIME
        for os_click in reversed(os_clicks):
            time_diff = abs(dom_click['timestamp'] - os_click['timestamp'])

            if time_diff > time_window_sec:
                break  # Too old

            # Found an OS click within time window - that's enough!
            return {
                'is_suspicious': False,
                'confidence': 1.0,
                'reason': None
            }

        # No OS click in time window
        return {
            'is_suspicious': True,
            'confidence': 0.9,
            'reason': f'No OS click within {TIME_WINDOW_MS}ms'
        }

    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        # Suppress default logging
        pass

def main():
    port = 9999
    server = HTTPServer(('127.0.0.1', port), ClickDetectionHandler)

    print('🔍 Click Detection SDK v0.1.0 (Python)')
    print('=' * 50)
    print()
    print('✓ Server initialized')
    print(f'🚀 API server listening on http://127.0.0.1:{port}')
    print()
    print('API Endpoints:')
    print('  GET  /api/health       - Health check')
    print('  GET  /api/stats        - Get statistics')
    print('  GET  /api/suspicious   - Get suspicious clicks')
    print('  POST /api/events/os    - Record OS click')
    print('  POST /api/events/dom   - Record DOM click')
    print()
    print('Next: Start the OS monitor in another terminal')
    print('  cd native && ./macos_monitor_test')
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n\n👋 Server stopped')
        server.shutdown()

if __name__ == '__main__':
    main()
