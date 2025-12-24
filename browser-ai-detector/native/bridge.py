#!/usr/bin/env python3
"""
Bridge between macOS native monitor and Unified Backend API
Captures OS clicks and forwards to API server
"""

import subprocess
import re
import sys
import requests
import time
from datetime import datetime

# Unified Backend API (port 8000)
SDK_API_URL = 'http://localhost:8000/api/click-detection/events/os'

def parse_log_line(line):
    """Parse OS monitor log line to extract click data"""
    # Looking for: [OS Monitor] Click detected: x=100.0, y=200.0, button=0, time=1234.567
    match = re.search(r'x=([\d.]+), y=([\d.]+), button=(\d+), time=([\d.]+)', line)
    if match:
        return {
            'x': float(match.group(1)),
            'y': float(match.group(2)),
            'button': int(match.group(3)),
            'timestamp': float(match.group(4))
        }
    return None

def send_to_api(click_data):
    """Send OS click to SDK API"""
    try:
        response = requests.post(SDK_API_URL, json=click_data, timeout=1)
        if response.status_code == 200:
            print(f"✓ Forwarded to SDK: x={click_data['x']:.1f}, y={click_data['y']:.1f}")
        else:
            print(f"✗ API error: {response.status_code}")
    except Exception as e:
        print(f"✗ Failed to send to API: {e}")

def main():
    print("🔗 OS Monitor Bridge")
    print("=" * 50)
    print("Forwarding OS clicks to SDK API at", SDK_API_URL)
    print("Starting native monitor...\n")

    # Start the native monitor as subprocess with unbuffered output
    process = subprocess.Popen(
        ['./macos_monitor_test'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=0,  # Unbuffered
        universal_newlines=True
    )

    try:
        for line in process.stdout:
            line = line.strip()
            print(f"[Monitor] {line}")

            # Parse and forward clicks
            click_data = parse_log_line(line)
            if click_data:
                send_to_api(click_data)

    except KeyboardInterrupt:
        print("\n\n👋 Stopping monitor...")
        process.terminate()
        sys.exit(0)

if __name__ == '__main__':
    main()
