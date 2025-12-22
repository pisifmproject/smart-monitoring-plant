#!/bin/bash
# Complete login system verification script

echo "=========================================="
echo "SMART MONITORING PLANT - LOGIN VERIFICATION"
echo "=========================================="
echo ""

# Test 1: Check backend
echo "1. Testing Backend API..."
echo "   Testing: http://10.125.48.102:2002/api/auth/login"

BACKEND_RESPONSE=$(curl -s -X POST http://10.125.48.102:2002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admifm"}')

if echo "$BACKEND_RESPONSE" | grep -q '"success":true'; then
  echo "   ✅ Backend: WORKING"
  echo "   Response: $BACKEND_RESPONSE" | head -c 100
  echo ""
else
  echo "   ❌ Backend: FAILED"
  echo "   Response: $BACKEND_RESPONSE"
  echo ""
fi

# Test 2: Check Vite config
echo "2. Checking Vite Configuration..."
if grep -q 'target.*2002/api' pisifmfe/frontend/vite.config.ts; then
  echo "   ✅ Vite proxy target: CORRECT (includes /api path)"
else
  echo "   ❌ Vite proxy target: INCORRECT"
fi

# Test 3: Check .env
echo ""
echo "3. Checking .env Configuration..."
if grep -q "VITE_API_URL=/api" pisifmfe/frontend/.env; then
  echo "   ✅ API URL: CORRECT (relative path /api)"
else
  echo "   ❌ API URL: INCORRECT"
  echo "   Current: $(cat pisifmfe/frontend/.env)"
fi

# Test 4: Check if server is running
echo ""
echo "4. Checking if services are running..."
if netstat -an | grep -q '2002'; then
  echo "   ✅ Backend (port 2002): RUNNING"
else
  echo "   ❌ Backend (port 2002): NOT RUNNING"
fi

if netstat -an | grep -q '30 '; then
  echo "   ✅ Frontend (port 30): RUNNING"
else
  echo "   ⚠️  Frontend (port 30): May not be running"
fi

echo ""
echo "=========================================="
echo "SUMMARY"
echo "=========================================="
echo "✅ If all above are working, login should work!"
echo "📍 Test login at: http://10.125.48.102:30/login"
echo "👤 Credentials: admin / admifm"
echo ""
echo "If still failing:"
echo "1. Clear browser cache (Ctrl+Shift+Delete)"
echo "2. Hard reload (Ctrl+Shift+R)"
echo "3. Check browser console for [AUTH] logs"
echo "4. Check Network tab for /api/auth/login request"
echo "=========================================="
