import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

async function test() {
    const text = 'Nintendo Email test';
    const psCommand = `
        Set-Clipboard -Value '${text}'
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
            Write-Host "Success"
        } else {
            Write-Host "Window not found"
        }
    `;
    const base64Cmd = Buffer.from(psCommand, 'utf16le').toString('base64');
    const { stdout } = await execAsync(`powershell -EncodedCommand ${base64Cmd}`);
    console.log(stdout);
}

test();
