const fs = require('fs');

const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const targetJS = `        const pwdInput = document.getElementById('cloud-password');
        const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
        if (copyPwdBtn && pwdInput) {
            copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value, this);
            });
        }`;

const replacementJS = targetJS + `

        const inviteLinkInput = document.getElementById('cloud-inviteLink');
        const openPikminBtn = document.getElementById('cloud-openPikminBtn');
        if (inviteLinkInput && openPikminBtn) {
            inviteLinkInput.addEventListener('input', function() {
                const val = this.value.trim();
                if (val) {
                    openPikminBtn.href = val;
                } else {
                    openPikminBtn.href = 'https://pikminbloom.onelink.me/pWSt/73s4bj4n'; // default
                }
            });
        }`;

if (jsContent.includes(targetJS)) {
    jsContent = jsContent.replace(targetJS, replacementJS);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js patched.');
} else {
    // try line by line replacement approach in case of line ending differences
    console.log('Fuzzy patch logic here if needed');
}
