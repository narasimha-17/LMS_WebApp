# Update DATABASE_URL in .env file

Write-Host "=== Update Database Credentials ===" -ForegroundColor Cyan
Write-Host ""

$mysqlUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Enter MySQL password" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

$dbName = "cms_dev"

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

Write-Host ""
Write-Host ".env file updated successfully!" -ForegroundColor Green
Write-Host "New DATABASE_URL: $newDatabaseUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now run: npm run start:prisma" -ForegroundColor Cyan
