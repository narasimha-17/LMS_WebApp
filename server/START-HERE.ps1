# LMS WebApp - Complete Setup Script
# This script will guide you through the setup process

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         LMS WebApp - Prisma Setup Assistant               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you set up MySQL and Prisma for your LMS project." -ForegroundColor White
Write-Host ""

# Check current status
Write-Host "Checking current setup..." -ForegroundColor Yellow
Write-Host ""

# Check if Prisma is generated
if (Test-Path "generated/prisma/index.js") {
    Write-Host "[✓] Prisma Client is generated" -ForegroundColor Green
} else {
    Write-Host "[✗] Prisma Client not generated" -ForegroundColor Red
    Write-Host "    Run: npm run prisma:generate" -ForegroundColor Yellow
}

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "[✓] .env file exists" -ForegroundColor Green
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match 'DATABASE_URL') {
        Write-Host "[✓] DATABASE_URL is configured" -ForegroundColor Green
    } else {
        Write-Host "[✗] DATABASE_URL not found in .env" -ForegroundColor Red
    }
} else {
    Write-Host "[✗] .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose your MySQL setup method:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Docker MySQL (RECOMMENDED - Easy, isolated, works reliably)" -ForegroundColor White
Write-Host "   - Requires Docker Desktop to be installed and running" -ForegroundColor Gray
Write-Host "   - Clean, isolated environment" -ForegroundColor Gray
Write-Host "   - Easy to reset and manage" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Local MySQL 9.4 (You have this installed)" -ForegroundColor White
Write-Host "   - Uses your existing MySQL installation" -ForegroundColor Gray
Write-Host "   - May need authentication fix for Prisma" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test existing connection" -ForegroundColor White
Write-Host "   - Check if database is already working" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting Docker MySQL setup..." -ForegroundColor Cyan
        .\setup-mysql-docker.ps1
    }
    "2" {
        Write-Host ""
        Write-Host "Setting up local MySQL..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Step 1: Fix authentication method" -ForegroundColor Yellow
        .\fix-local-mysql.ps1
        Write-Host ""
        Write-Host "Step 2: Import database" -ForegroundColor Yellow
        .\setup-database.ps1
    }
    "3" {
        Write-Host ""
        Write-Host "Testing connection..." -ForegroundColor Cyan
        npm run test:setup
    }
    "4" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Setup script completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the setup: npm run test:setup" -ForegroundColor White
Write-Host "2. Start the server: npm run start:prisma" -ForegroundColor White
Write-Host "3. Test the API: http://localhost:4000/api/certifications" -ForegroundColor White
Write-Host ""
