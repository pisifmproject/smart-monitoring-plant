$body = @{
    username = 'admin'
    password = 'admifm'
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
}

Write-Host "Testing Backend API..."
Write-Host "URL: http://10.125.48.102:2002/api/auth/login"
Write-Host "Body: $body"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri 'http://10.125.48.102:2002/api/auth/login' -Method POST -Headers $headers -Body $body
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Response:"
    Write-Host $_.Exception.Response | Select-Object -Property *
}
