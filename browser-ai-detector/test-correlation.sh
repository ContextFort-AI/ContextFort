#!/bin/bash

echo "Testing Click Correlation..."
echo "=============================="
echo

# Test 1: Legitimate click (OS + DOM within window)
echo "Test 1: Simulating LEGITIMATE click (OS + DOM match)"
TIMESTAMP=$(python3 -c "import time; print(time.time())")

# Send OS click
curl -s -X POST http://localhost:9999/api/events/os \
  -H "Content-Type: application/json" \
  -d "{\"x\": 500, \"y\": 300, \"timestamp\": $TIMESTAMP}" > /dev/null

# Send matching DOM click 50ms later
TIMESTAMP2=$(python3 -c "import time; print($TIMESTAMP + 0.05)")
RESULT=$(curl -s -X POST http://localhost:9999/api/events/dom \
  -H "Content-Type: application/json" \
  -d "{\"x\": 505, \"y\": 305, \"timestamp\": $TIMESTAMP2}")

echo "Result: $RESULT"
echo

# Test 2: Suspicious click (only DOM, no OS)
echo "Test 2: Simulating SUSPICIOUS click (DOM only, no OS)"
TIMESTAMP3=$(python3 -c "import time; print(time.time())")

RESULT2=$(curl -s -X POST http://localhost:9999/api/events/dom \
  -H "Content-Type: application/json" \
  -d "{\"x\": 700, \"y\": 400, \"timestamp\": $TIMESTAMP3}")

echo "Result: $RESULT2"
echo

# Show stats
echo "Stats:"
curl -s http://localhost:9999/api/stats | python3 -m json.tool
echo

echo "Check suspicious clicks:"
curl -s http://localhost:9999/api/suspicious | python3 -m json.tool
