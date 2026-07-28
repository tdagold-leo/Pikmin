$token = "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"
$owner = "tdagold-leo"
$repo = "Pikmin"

# --- 自動更新 index.html 內的版號 (APP_VERSION) ---
$localIndexFile = "$PSScriptRoot\index.html"
$timestamp = Get-Date -Format "yyyy.MM.dd.HHmm"
Write-Host "Auto-updating APP_VERSION to $timestamp..." -ForegroundColor Cyan
$htmlContent = Get-Content -Path $localIndexFile -Raw -Encoding UTF8
$htmlContent = $htmlContent -replace 'const APP_VERSION = "[^"]+";', "const APP_VERSION = `"$timestamp`";"
Set-Content -Path $localIndexFile -Value $htmlContent -Encoding UTF8
# ---------------------------------------------

$filesToUpload = @(
    "index.html",
    "js/main.js",
    "js/main.min.js"
)

$headers = @{ Authorization = "Bearer $token"; "Accept" = "application/vnd.github.v3+json" }

foreach ($path in $filesToUpload) {
    Write-Host "Pushing $path to GitHub ($owner/$repo)..."
    
    $localFile = "$PSScriptRoot\$($path -replace '/', '\')"
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
        message = "Auto-update $path from local script"
        content = $base64
    }
    if ($sha) { $bodyObj.sha = $sha }

    $body = $bodyObj | ConvertTo-Json -Depth 10

    try {
        $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $body -ContentType "application/json"
        Write-Host "Upload $path success!" -ForegroundColor Green
    } catch {
        Write-Host "Upload $path failed: $_" -ForegroundColor Red
    }
}

Write-Host "All uploads completed!"
Start-Sleep -Seconds 5

