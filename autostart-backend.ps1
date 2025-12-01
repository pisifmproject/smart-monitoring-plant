# PISIFM Backend Auto-Start PowerShell Script
# Script ini akan dijalankan otomatis saat Windows boot via Task Scheduler

$BackendPath = "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe"
$LogFile = "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\backend-autostart.log"

# Log start time
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogFile -Value "[$timestamp] Starting PISIFM Backend..."

# Set working directory
Set-Location $BackendPath

# Start backend
try {
    Add-Content -Path $LogFile -Value "[$timestamp] Backend starting on port 2000..."
    & node dist\server.js 2>&1 | Add-Content -Path $LogFile
} catch {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$timestamp] ERROR: $($_.Exception.Message)"
}
