# Start n8n Workflow Automation Engine Locally (No Docker Required)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting n8n Automation Engine (Local) " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URL: http://localhost:5678" -ForegroundColor Green
Write-Host "Import Workflow from: d:\Team Parsu\n8n\vilp_placement_automation_workflow.json`n" -ForegroundColor Yellow

npx n8n
