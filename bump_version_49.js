const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/\r\n/g, '\n');

const target = `                    sgEnd: cloudData[key].sgEnd || null,
                    sgActivity: cloudData[key].sgActivity || "",
                    sgCooldown: cloudData[key].sgCooldown || "",`;

const replace = `                    sgEnd: cloudData[key].sgEnd || null,
                    sgActivity: cloudData[key].sgActivity || "",
                    sgSubActivity: cloudData[key].sgSubActivity || "",
                    sgCooldown: cloudData[key].sgCooldown || "",`;

if (js.includes(target)) {
    js = js.replace(target, replace);
    js = js.replace(/v=\d{10,14}/g, 'v=202610110330');
    fs.writeFileSync('js/main.js', js);
    
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/v=\d{10,14}/g, 'v=202610110330');
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0330"');
    fs.writeFileSync('index.html', html);
    
    console.log('Fixed snapshot mapping!');
} else {
    console.log('Target not found.');
}
