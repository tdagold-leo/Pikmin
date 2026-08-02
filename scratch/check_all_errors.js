const fs = require('fs');
const vm = require('vm');

console.log('=== 1. Checking JS Syntax for all JS files ===');
const jsFiles = ['js/main.js', 'js/autofill.js', 'js/pure_map.js', 'js/dedup.js', 'js/import.js'];
jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf-8');
    try {
        new vm.Script(content, { filename: file });
        console.log('[PASS] ' + file + ' syntax OK');
    } catch(err) {
        console.error('[FAIL] ' + file + ' syntax error:', err.message, err.stack);
    }
});

console.log('\n=== 2. Checking index.html element ID references ===');
const html = fs.readFileSync('index.html', 'utf-8');
const mainJs = fs.readFileSync('js/main.js', 'utf-8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const usedIds = new Set();
while ((match = idRegex.exec(mainJs)) !== null) {
    usedIds.add(match[1]);
}

const missingIds = [];
usedIds.forEach(id => {
    // Dynamic IDs like m-h-${id}, pc-h-${id}, etc. are created dynamically
    if (id.includes('${') || id.startsWith('m-h-') || id.startsWith('pc-h-') || id.startsWith('m-m-') || id.startsWith('pc-m-')) {
        return;
    }
    const hasDouble = html.includes('id="' + id + '"');
    const hasSingle = html.includes("id='" + id + "'");
    if (!hasDouble && !hasSingle) {
        missingIds.push(id);
    }
});
console.log('Referenced static IDs in main.js not found in index.html:', missingIds);

console.log('\n=== 3. Checking for undefined function calls from HTML onclick/onchange ===');
const eventRegex = /on[a-z]+\s*=\s*["']([^"']+)["']/gi;
const calledFuncs = new Set();
let evMatch;
while ((evMatch = eventRegex.exec(html)) !== null) {
    const code = evMatch[1];
    const funcMatch = code.match(/([a-zA-Z0-9_$]+)\s*\(/);
    if (funcMatch) {
        calledFuncs.add(funcMatch[1]);
    }
}

const globalFuncs = [];
calledFuncs.forEach(func => {
    // Check if defined in mainJs or autofill or standard
    const inMain = mainJs.includes('function ' + func) || mainJs.includes('window.' + func) || mainJs.includes(func + ' =');
    const isStandard = ['alert', 'confirm', 'prompt', 'focus', 'blur', 'close', 'open', 'print'].includes(func);
    if (!inMain && !isStandard) {
        globalFuncs.push(func);
    }
});
console.log('HTML event handlers calling functions missing from main.js:', globalFuncs);
