Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SMART MONITORING PLANT - LOGIN VERIFICATION" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check backend
Write-Host "1. Testing Backend API..." -ForegroundColor Yellow
Write-Host "   Testing: http://10.125.48.102:2002/api/auth/login"

try {
    $body = @{username='admin'; password='admifm'} | ConvertTo-Json
    $headers = @{'Content-Type'='application/json'}
    $response = Invoke-WebRequest -Uri 'http://10.125.48.102:2002/api/auth/login' `
        -Method POST -Headers $headers -Body $body
    
    if ($response.Content -like '*"success":true*') {
        Write-Host "   ✅ Backend: WORKING" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "   Success: $($json.success), User: $($json.user.username)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend: FAILED" -ForegroundColor Red
        Write-Host "   Response: $($response.Content)"
    }
} catch {
    Write-Host "   ❌ Backend: ERROR" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host ""

# Test 2: Check Vite config
Write-Host "2. Checking Vite Configuration..." -ForegroundColor Yellow
$viteConfig = Get-Content 'pisifmfe\frontend\vite.config.ts' -Raw
if ($viteConfig -match 'target.*2002/api') {
    Write-Host "   ✅ Vite proxy target: CORRECT (includes /api)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Vite proxy target: INCORRECT" -ForegroundColor Red
}

Write-Host ""

# Test 3: Check .env
Write-Host "3. Checking .env Configuration..." -ForegroundColor Yellow
$envContent = Get-Content 'pisifmfe\frontend\.env' -Raw
if ($envContent -match 'VITE_API_URL=/api') {
    Write-Host "   ✅ API URL: CORRECT (relative path /api)" -ForegroundColor Green
} else {
    Write-Host "   ❌ API URL: INCORRECT" -ForegroundColor Red
    Write-Host "   Current: $envContent"
}

Write-Host ""

# Test 4: Check if ports are in use
Write-Host "4. Checking if services are running..." -ForegroundColor Yellow
$netstat = netstat -ano

if ($netstat | Select-String -Pattern ':2002') {
    Write-Host "   ✅ Backend (port 2002): RUNNING" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend (port 2002): NOT RUNNING" -ForegroundColor Red
}

if ($netstat | Select-String -Pattern ':30 ') {
    Write-Host "   ✅ Frontend (port 30): RUNNING" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Frontend (port 30): May not be running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ If all above are working, login should work!"
Write-Host "📍 Test login at: http://10.125.48.102:30/login"
Write-Host "👤 Credentials: admin / admifm"
Write-Host ""
Write-Host "If still failing:"
Write-Host "1. Clear browser cache (Ctrl+Shift+Delete)"
Write-Host "2. Hard reload (Ctrl+Shift+R)"
Write-Host "3. Check browser console for [AUTH] logs"
Write-Host "4. Check Network tab for /api/auth/login request"
Write-Host "==========================================" -ForegroundColor Cyan
