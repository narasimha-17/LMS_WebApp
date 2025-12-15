# Fix Local MySQL 9.4 Authentication Issue
# MySQL 9.4 uses caching_sha2_password which Prisma may not support well

Write-Host "=== Fix Local MySQL Authentication ===" -ForegroundColor Cyan
Write-Host ""

$mysqlExe = "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"

if (-not (Test-Path $mysqlExe)) {
    Write-Host "MySQL not found at expected location." -ForegroundColor Red
    exit 1
}

Write-Host "This script will change root user authentication to mysql_native_password" -ForegroundColor Yellow
Write-Host ""

$password = Read-Host "Enter a password for root user (or press Enter for no password)" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "Updating MySQL root user authentication..." -ForegroundColor Yellow

$sqlCommands = @"
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$passwordPlain';
FLUSH PRIVILEGES;
"@

$sqlCommands | & $mysqlExe -u root 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Authentication method updated successfully!" -ForegroundColor Green
    
    # Update .env
    Write-Host "Updating .env file..." -ForegroundColor Yellow
    $envFile = ".env"
    $envContent = Get-Content $envFile -Raw
    
    if ([string]::IsNullOrWhiteSpace($passwordPlain)) {
        $newDatabaseUrl = 'DATABASE_URL="mysql://root@localhost:3306/cms_dev"'
    } else {
        $newDatabaseUrl = "DATABASE_URL=`"mysql://root:${passwordPlain}@localhost:3306/cms_dev`""
    }
    
    $envContent = $envContent -replace 'DATABASE_URL="[^"]*"', $newDatabaseUrl
    Set-Content -Path $envFile -Value $envContent
    
    Write-Host ".env file updated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Try running: npm run start:prisma" -ForegroundColor Cyan
} else {
    Write-Host "Failed to update authentication." -ForegroundColor Red
    Write-Host "You may need to run MySQL as administrator or use Docker instead." -ForegroundColor Yellow
}
