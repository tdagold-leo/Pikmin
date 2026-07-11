$token = "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"
$owner = "tdagold-leo"
$repo = "Pikmin"
$path = "index.html"
$localFile = "$PSScriptRoot\index.html"

Write-Host "Pushing to GitHub ($owner/$repo)..."

$headers = @{ Authorization = "Bearer $token"; "Accept" = "application/vnd.github.v3+json" }
$url = "https://api.github.com/repos/$owner/$repo/contents/$path"

try {
    $currentFile = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    $sha = $currentFile.sha
} catch {
    $sha = $null
}

$content = [System.IO.File]::ReadAllBytes($localFile)
$base64 = [Convert]::ToBase64String($content)

$bodyObj = @{
    message = "Auto-update from local script"
    content = $base64
}
if ($sha) { $bodyObj.sha = $sha }

$body = $bodyObj | ConvertTo-Json -Depth 10

try {
    $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $body -ContentType "application/json"
    Write-Host "Upload success!" -ForegroundColor Green
    Write-Host "Commit URL: $($res.commit.html_url)"
} catch {
    Write-Host "Upload failed: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 5
