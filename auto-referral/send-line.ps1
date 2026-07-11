param (
    [Parameter(Mandatory=$true)]
    [string]$Text
)

Set-Clipboard -Value $Text
$wshell = New-Object -ComObject wscript.shell
$success = $wshell.AppActivate('傻惠+')
if (-not $success) {
    $success = $wshell.AppActivate('LINE')
}

if ($success) {
    Start-Sleep -Milliseconds 500
    $wshell.SendKeys('^v')
    Start-Sleep -Milliseconds 100
    $wshell.SendKeys('{ENTER}')
} else {
    Write-Host "Window not found"
}
