# Authentication Setup Script
# Run this script to set up the authentication system

Write-Host "🚀 Setting up Authentication System..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Install backend dependencies
Write-Host "📦 Step 1: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location -Path "pisifmbe"

if (Test-Path "package.json") {
    Write-Host "Installing bcryptjs, jsonwebtoken..." -ForegroundColor Gray
    npm install bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken axios
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        Set-Location -Path ".."
        exit 1
    }
} else {
    Write-Host "❌ package.json not found in pisifmbe" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Write-Host ""

# Step 2: Run database migration
Write-Host "📊 Step 2: Running database migration..." -ForegroundColor Yellow
Write-Host "Please run the migration manually using one of these methods:" -ForegroundColor Gray
Write-Host "  Option 1: npx drizzle-kit push:pg" -ForegroundColor Gray
Write-Host "  Option 2: psql -U your_username -d your_database -f drizzle/0013_add_users_table.sql" -ForegroundColor Gray
Write-Host ""
$confirm = Read-Host "Have you run the migration? (y/n)"

if ($confirm -ne "y") {
    Write-Host "⚠️  Please run the migration before continuing" -ForegroundColor Yellow
    Set-Location -Path ".."
    exit 0
}

Write-Host ""

# Step 3: Seed users
Write-Host "🌱 Step 3: Seeding users..." -ForegroundColor Yellow
Write-Host "Running seed script..." -ForegroundColor Gray

npx tsx seed-users.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Users seeded successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to seed users" -ForegroundColor Red
    Write-Host "Please check your database connection and try again" -ForegroundColor Yellow
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."
Write-Host ""

# Step 4: Install frontend dependencies
Write-Host "📦 Step 4: Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path "pisifmfe/frontend"

if (Test-Path "package.json") {
    Write-Host "Frontend dependencies should already be installed" -ForegroundColor Gray
    Write-Host "If you encounter issues, run: npm install axios" -ForegroundColor Gray
    Write-Host "✅ Frontend check complete" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found in pisifmfe/frontend" -ForegroundColor Red
    Set-Location -Path "../.."
    exit 1
}

Set-Location -Path "../.."
Write-Host ""

# Summary
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Default Users:" -ForegroundColor Cyan
Write-Host "  admin      / admifm   (Administrator)" -ForegroundColor White
Write-Host "  supervisor / spvifm   (Supervisor)" -ForegroundColor White
Write-Host "  operator   / oprifm   (Operator)" -ForegroundColor White
Write-Host "  maintenance/ mtcifm   (Maintenance)" -ForegroundColor White
Write-Host "  qc         / qcifm    (Quality Control)" -ForegroundColor White
Write-Host "  management / mngifm   (Management)" -ForegroundColor White
Write-Host "  guest      / gsifm    (Viewer)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Environment Variables:" -ForegroundColor Cyan
Write-Host "  Backend (pisifmbe/.env):" -ForegroundColor White
Write-Host "    JWT_SECRET=your-secret-key-change-in-production" -ForegroundColor Gray
Write-Host "    DATABASE_URL=your-postgresql-connection-string" -ForegroundColor Gray
Write-Host ""
Write-Host "  Frontend (pisifmfe/frontend/.env):" -ForegroundColor White
Write-Host "    VITE_API_URL=http://localhost:2000/api" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Set environment variables" -ForegroundColor White
Write-Host "  2. Start backend:  cd pisifmbe && npm run dev" -ForegroundColor White
Write-Host "  3. Start frontend: cd pisifmfe/frontend && npm run dev" -ForegroundColor White
Write-Host "  4. Visit http://localhost:5173 and login!" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more details, see AUTH_SETUP.md" -ForegroundColor Cyan
Write-Host ""
