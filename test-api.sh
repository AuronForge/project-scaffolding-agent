#!/bin/bash
# Test script for REST API endpoints

BASE_URL="http://localhost:3002"

echo "🧪 Testing Project Scaffolding Agent REST API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing GET /api/health"
echo "Request: GET $BASE_URL/api/health"
curl -s $BASE_URL/api/health | python -m json.tool 2>/dev/null || curl -s $BASE_URL/api/health
echo ""
echo ""

# Test 2: Get Templates
echo "2️⃣  Testing GET /api/projects/templates"
echo "Request: GET $BASE_URL/api/projects/templates"
curl -s $BASE_URL/api/projects/templates | python -m json.tool 2>/dev/null || curl -s $BASE_URL/api/projects/templates
echo ""
echo ""

# Test 3: Preview Project
echo "3️⃣  Testing POST /api/projects/preview"
echo "Request: POST $BASE_URL/api/projects/preview"
echo "Body: {\"projectName\":\"test-api\",\"front\":\"Backend\",\"technology\":\"Node.js\",\"version\":\"20\"}"
curl -s -X POST $BASE_URL/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{"projectName":"test-api","front":"Backend","technology":"Node.js","version":"20"}' \
  | python -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{"projectName":"test-api","front":"Backend","technology":"Node.js","version":"20"}'
echo ""
echo ""

# Test 4: Preview with Dependencies
echo "4️⃣  Testing POST /api/projects/preview (with dependencies)"
echo "Request: POST $BASE_URL/api/projects/preview"
echo "Body: Full project configuration"
curl -s -X POST $BASE_URL/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{
    "projectName":"my-express-api",
    "front":"Backend",
    "technology":"Node.js",
    "version":"20",
    "dependencies":["Express","Prisma","Jest"],
    "includeTests":true,
    "includeCICD":true,
    "includeDocker":true
  }' | python -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{"projectName":"my-express-api","front":"Backend","technology":"Node.js","version":"20","dependencies":["Express","Prisma","Jest"],"includeTests":true,"includeCICD":true,"includeDocker":true}'
echo ""
echo ""

# Test 5: Invalid Request (Missing fields)
echo "5️⃣  Testing POST /api/projects/preview (invalid - missing fields)"
echo "Request: POST $BASE_URL/api/projects/preview"
echo "Body: {\"projectName\":\"test\"}"
curl -s -X POST $BASE_URL/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{"projectName":"test"}' \
  | python -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{"projectName":"test"}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tests completed!"
