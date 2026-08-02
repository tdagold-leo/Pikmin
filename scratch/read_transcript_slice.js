const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\6180e79f-ad0f-4275-9ce2-4b98ca15fcef\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(path);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

let lineNum = 0;

rl.on('line', (line) => {
    lineNum++;
    if (lineNum >= 2050 && lineNum <= 2130) {
        try {
            const obj = JSON.parse(line);
            console.log(`[Line ${lineNum} - ${obj.type} - ${obj.source}]:`);
            if (obj.content) console.log(obj.content.substring(0, 500));
            if (obj.tool_calls) console.log('Tool calls:', JSON.stringify(obj.tool_calls).substring(0, 300));
            console.log('===');
        } catch(e) {}
    }
});
