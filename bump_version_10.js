const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace standard accept with the new one.
const oldAccept = `accept=".gpx,.kml,.json"`;
const newAccept = `accept=".gpx,.kml,.json,.txt,.csv"`;

if (html.includes(oldAccept)) {
    html = html.replace(oldAccept, newAccept);
    fs.writeFileSync('index.html', html);
    console.log('patched successfully');
} else {
    // try to find it
    if (html.includes('id="route-upload-file"')) {
        html = html.replace(/accept="[^"]*"/, `accept=".gpx,.kml,.json,.txt,.csv"`);
        fs.writeFileSync('index.html', html);
        console.log('regex patched successfully');
    }
}
