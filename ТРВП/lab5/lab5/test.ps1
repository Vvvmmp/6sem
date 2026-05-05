$methods = @("GET", "POST", "PUT", "DELETE")
$results = @{ "X" = 0; "Y" = 0; "Z" = 0 }

foreach ($method in $methods) {
    Write-Host "Running 50 requests for $method..." -ForegroundColor Cyan
    for ($i = 1; $i -le 50; $i++) {
        try {
            $resp = Invoke-RestMethod -Uri "http://localhost:5000/lb" -Method $method
            $results[$resp.Nick]++
        } catch {
            Write-Host "Error" -ForegroundColor Red
        }
    }
}

Write-Host "`n--- RESULTS ---" -ForegroundColor Yellow
$results.GetEnumerator() | Sort-Object Name | ForEach-Object {
    Write-Host "Server $($_.Name): $($_.Value) requests"
}