const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\6180e79f-ad0f-4275-9ce2-4b98ca15fcef\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(path);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

let userInputs = [];
let lineNum = 0;

rl.on('line', (line) => {
    lineNum++;
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            userInputs.push({ idx: userInputs.length + 1, lineNum, content: obj.content });
        }
    } catch (e) {}
});

rl.on('close', () => {
    userInputs.slice(0, 42).forEach(u => {
        console.log(`[${u.idx}] line ${u.lineNum}:\n${u.content.trim()}\n---`);
    });
});
