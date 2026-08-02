const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\6180e79f-ad0f-4275-9ce2-4b98ca15fcef\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(path);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

let lineNum = 0;
let matches = [];

rl.on('line', (line) => {
    lineNum++;
    if (line.includes('免洗') || line.includes('73s4bj4n') || line.includes('cloud-referralCode') || line.includes('cloud-startBtn') || line.includes('複製密碼 & 開啟') || line.includes('複製信箱 & 開啟')) {
        matches.push({ lineNum, preview: line.substring(0, 300) });
    }
});

rl.on('close', () => {
    console.log('Total matches:', matches.length);
    matches.forEach(m => console.log(`Line ${m.lineNum}: ${m.preview}`));
});
