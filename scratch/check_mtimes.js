const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb');
files.filter(f => f.endsWith('.js') || f.endsWith('.py')).forEach(f => {
    const stat = fs.statSync(path.join('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb', f));
    console.log(`${f.padEnd(25)} : ${stat.mtime.toISOString()} (${stat.size} bytes)`);
});
