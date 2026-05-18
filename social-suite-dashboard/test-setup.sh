#!/bin/bash

# Test script for Social Suite Dashboard

echo "Testing Social Suite Dashboard setup..."

# Test if docker-compose is available
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found"
    exit 1
fi

# Test if the API is running
echo "Checking if API is running..."
curl -s http://localhost:8000/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ API is running"
else
    echo "✗ API is not running"
fi

# Test if the NLP service is running
echo "Checking if NLP service is running..."
curl -s http://localhost:8001/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ NLP service is running"
else
    echo "✗ NLP service is not running"
fi

# Test NLP interpretation
echo "Testing NLP interpretation..."
curl -s -X POST http://localhost:8001/interpret \
  -H "Content-Type: application/json" \
  -d '{"text":"run a lead-gen ad for cafés in Windsor with $25/day"}' > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ NLP interpretation test passed"
else
    echo "✗ NLP interpretation test failed"
fi

echo "Test completed."