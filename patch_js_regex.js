const fs = require('fs');

const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const regex = /copyPwdBtn\.addEventListener\('click', function\(\) \{\s*copyToClipboard\(pwdInput\.value, this\);\s*\}\);\s*\}/;

const replacement = `copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value, this);
            });
        }

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

if (regex.test(jsContent)) {
    jsContent = jsContent.replace(regex, replacement);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js patched with regex.');
} else {
    console.log('Regex failed.');
}
