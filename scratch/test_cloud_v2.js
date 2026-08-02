const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

const dom = new JSDOM(indexHtml, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'https://tdagold-leo.github.io/Pikmin/'
});

const { window } = dom;
const { document } = window;

console.log('--- Testing Cloud V2 Elements ---');
const elementsToCheck = [
    'cloud-referralCode',
    'cloud-copyRefCodeBtn',
    'cloud-password',
    'cloud-copyPwdBtn',
    'cloud-inviteLink',
    'cloud-inviteName',
    'cloud-saveInviteBtn',
    'cloud-isPublic',
    'cloud-savedLocalLinksList',
    'cloud-savedPublicLinksList',
    'cloud-openPikminBtn',
    'cloud-startBtn',
    'cloud-emailBox',
    'cloud-emailDisplay',
    'cloud-copyEmailBtn',
    'cloud-codeBox',
    'cloud-codeDisplay',
    'cloud-copyCodeBtn',
    'cloud-logContainer'
];

elementsToCheck.forEach(id => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing element: #${id}`);
    console.log(`[PASS] Found #${id}`);
});

console.log('All elements present!');
