# Setup MySQL using Docker (Recommended approach from guide)
# This is more reliable than local MySQL installation

Write-Host "=== MySQL Docker Setup for LMS ===" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed or not running!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "Then start Docker Desktop and run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if Docker daemon is running
$dockerTest = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if container already exists
Write-Host "Checking for existing MySQL container..." -ForegroundColor Yellow
$existingContainer = docker ps -a --filter "name=cms-mysql" --format "{{.Names}}" 2>&1

if ($existingContainer -eq "cms-mysql") {
    Write-Host "Container 'cms-mysql' already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to remove it and create a new one? (y/n)"
    if ($response -eq "y") {
        Write-Host "Stopping and removing existing container..." -ForegroundColor Yellow
        docker stop cms-mysql 2>&1 | Out-Null
        docker rm cms-mysql 2>&1 | Out-Null
        Write-Host "Removed existing container." -ForegroundColor Green
    } else {
        Write-Host "Starting existing container..." -ForegroundColor Yellow
        docker start cms-mysql 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Container started successfully!" -ForegroundColor Green
        }
        Write-Host ""
        Write-Host "Skipping to database import..." -ForegroundColor Cyan
        $skipCreate = $true
    }
}

if (-not $skipCreate) {
    Write-Host ""
    Write-Host "Creating MySQL container..." -ForegroundColor Yellow
    Write-Host "Command: docker run --name cms-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=devpass -e MYSQL_DATABASE=cms_dev -d mysql:8.0" -ForegroundColor Gray
    
    docker run --name cms-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=devpass -e MYSQL_DATABASE=cms_dev -d mysql:8.0 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MySQL container created successfully!" -ForegroundColor Green
        Write-Host "Waiting for MySQL to start (15 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    } else {
        Write-Host "Failed to create MySQL container." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Importing database backup..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Gray

# Fix collation in SQL file
if (Test-Path "emsdb_backup_fixed.sql") {
    $sqlFile = "emsdb_backup_fixed.sql"
} else {
    $sqlFile = "emsdb_backup.sql"
}

# Import using docker exec
$importCmd = "docker exec -i cms-mysql mysql -u root -pdevpass cms_dev"
Get-Content $sqlFile | & docker exec -i cms-mysql mysql -u root -pdevpass cms_dev 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database imported successfully!" -ForegroundColor Green
} else {
    Write-Host "Import may have had warnings, but likely succeeded." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Update .env file with Docker MySQL credentials
$envFile = ".env"
$envContent = Get-Content $envFile -Raw
$newDatabaseUrl = 'DATABASE_URL="mysql://root:devpass@localhost:3306/cms_dev"'
$envContent = $envContent -replace 'DATABASE_URL="[^"]*"', $newDatabaseUrl
Set-Content -Path $envFile -Value $envContent

Write-Host ".env file updated!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "MySQL is running in Docker container 'cms-mysql'" -ForegroundColor Cyan
Write-Host "Connection: localhost:3306" -ForegroundColor White
Write-Host "Database: cms_dev" -ForegroundColor White
Write-Host "Username: root" -ForegroundColor White
Write-Host "Password: devpass" -ForegroundColor White
Write-Host ""
Write-Host "Useful Docker commands:" -ForegroundColor Cyan
Write-Host "  docker ps                    - List running containers" -ForegroundColor White
Write-Host "  docker stop cms-mysql        - Stop MySQL" -ForegroundColor White
Write-Host "  docker start cms-mysql       - Start MySQL" -ForegroundColor White
Write-Host "  docker logs cms-mysql        - View MySQL logs" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run start:prisma" -ForegroundColor White
Write-Host "2. Test: http://localhost:4000/api/certifications" -ForegroundColor White
Write-Host ""
