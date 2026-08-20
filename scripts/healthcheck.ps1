# VILP Platform Automated Health Check Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " VILP Platform Status & Telemetry Check " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Check Backend Health
$backendUrl = "http://localhost:8080/actuator/health"
Write-Host "`n[1] Checking Spring Boot Backend Health ($backendUrl)..." -NoNewline
try {
    $res = Invoke-RestMethod -Uri $backendUrl -TimeoutSec 5 -ErrorAction Stop
    if ($res.status -eq "UP") {
        Write-Host " [ONLINE - UP]" -ForegroundColor Green
    } else {
        Write-Host " [STATUS: $($res.status)]" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [OFFLINE - Not reachable]" -ForegroundColor Red
}

# 2. Check Frontend Status
$frontendUrl = "http://localhost:5173"
Write-Host "[2] Checking Vite React Frontend ($frontendUrl)..." -NoNewline
try {
    $res = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 5 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
        Write-Host " [ONLINE - 200 OK]" -ForegroundColor Green
    } else {
        Write-Host " [STATUS: $($res.StatusCode)]" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [OFFLINE - Not reachable]" -ForegroundColor Red
}

# 3. Check Mailhog Status
$mailhogUrl = "http://localhost:8025"
Write-Host "[3] Checking Mailhog Dev Mailer ($mailhogUrl)..." -NoNewline
try {
    $res = Invoke-WebRequest -Uri $mailhogUrl -TimeoutSec 5 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
        Write-Host " [ONLINE - 200 OK]" -ForegroundColor Green
    } else {
        Write-Host " [STATUS: $($res.StatusCode)]" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [OFFLINE - Not reachable]" -ForegroundColor Red
}

Write-Host "`nHealthcheck complete.`n"
