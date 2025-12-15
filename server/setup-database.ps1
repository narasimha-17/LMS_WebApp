# PowerShell Script to Setup Database for LMS WebApp
# Run this script after installing MySQL

Write-Host "=== LMS Database Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Find MySQL installation
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlExe = $path
        Write-Host "Found MySQL at: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlExe) {
    Write-Host "MySQL not found. Please install MySQL or XAMPP first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Prompt for MySQL credentials
$mysqlUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Enter MySQL password (press Enter if no password)" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

# Database name
$dbName = "cms_dev"

Write-Host ""
Write-Host "Creating database '$dbName'..." -ForegroundColor Yellow

# Create database command
$createDbSql = "CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if ([string]::IsNullOrWhiteSpace($mysqlPasswordPlain)) {
    $result = cmd /c "echo $createDbSql | `"$mysqlExe`" -u $mysqlUser 2>&1"
} else {
    $result = cmd /c "echo $createDbSql | `"$mysqlExe`" -u $mysqlUser -p$mysqlPasswordPlain 2>&1"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to create database." -ForegroundColor Red
    Write-Host $result
    exit 1
}

Write-Host ""
Write-Host "Fixing collation compatibility..." -ForegroundColor Yellow
(Get-Content emsdb_backup.sql -Raw) -replace 'utf8mb4_0900_ai_ci', 'utf8mb4_unicode_ci' | Set-Content emsdb_backup_fixed.sql

Write-Host "Importing database backup (this may take a minute)..." -ForegroundColor Yellow

# Import backup using cmd
if ([string]::IsNullOrWhiteSpace($mysqlPasswordPlain)) {
    $result = cmd /c "`"$mysqlExe`" -u $mysqlUser $dbName < emsdb_backup_fixed.sql 2>&1"
} else {
    $result = cmd /c "`"$mysqlExe`" -u $mysqlUser -p$mysqlPasswordPlain $dbName < emsdb_backup_fixed.sql 2>&1"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database imported successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to import database." -ForegroundColor Red
    Write-Host $result
    exit 1
}

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Update .env file
$envFile = ".env"
$envContent = Get-Content $envFile -Raw

if ([string]::IsNullOrWhiteSpace($mysqlPasswordPlain)) {
    $newDatabaseUrl = "DATABASE_URL=`"mysql://${mysqlUser}@localhost:3306/${dbName}`""
} else {
    $newDatabaseUrl = "DATABASE_URL=`"mysql://${mysqlUser}:${mysqlPasswordPlain}@localhost:3306/${dbName}`""
}

# Replace DATABASE_URL line
$envContent = $envContent -replace 'DATABASE_URL="[^"]*"', $newDatabaseUrl
Set-Content -Path $envFile -Value $envContent

Write-Host ".env file updated!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run start:prisma" -ForegroundColor White
Write-Host "2. Open: http://localhost:4000/api/certifications" -ForegroundColor White
Write-Host ""
