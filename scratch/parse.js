const fs = require('fs');
const path = require('path');

const inputText = fs.readFileSync(path.join(__dirname, 'pure_map_input.txt'), 'utf-8');
const lines = inputText.split('\n');

const results = [];
let currentCategory = '未分類';
let pendingName = '';

const coordRegex = /(-?\d{1,3}\.\d+)[^\d\.\-]+(-?\d{1,3}\.\d+)/;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Check if category header
    if (line.match(/[★●▲✏️]/)) {
        // clean up category name
        currentCategory = line.replace(/[★●▲✏️0-9\.\s]/g, '').trim();
        if (currentCategory.includes('（')) currentCategory = currentCategory.split('（')[0];
        if (currentCategory.includes('~')) currentCategory = currentCategory.split('~')[0];
        pendingName = '';
        continue;
    }

    const match = line.match(coordRegex);
    if (match) {
        let lat = parseFloat(match[1]);
        let lng = parseFloat(match[2]);

        // Fix if lat/lng are swapped (Taiwan lng is 120-122, lat is 22-25)
        if (lat > 100 && lng < 100) {
            const temp = lat;
            lat = lng;
            lng = temp;
        }

        // extract name from line
        let name = line.replace(match[0], '').trim();
        name = name.replace(/\(check mark\)/gi, '').replace(/\(我可以\)/g, '').trim();
        name = name.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
        
        if (!name && pendingName) {
            name = pendingName;
        } else if (pendingName) {
            name = pendingName + ' - ' + name;
        }

        if (!name) name = currentCategory;

        results.push({
            name: name,
            lat: lat,
            lng: lng,
            type: currentCategory
        });
        pendingName = '';
    } else {
        // Line without coordinates and not a category header
        // Maybe it's a location prefix like "桃園:"
        pendingName = line.replace(/:$/, '').trim();
    }
}

const portalsPath = path.join(__dirname, '../data/portals.json');
let existing = [];
if (fs.existsSync(portalsPath)) {
    existing = JSON.parse(fs.readFileSync(portalsPath, 'utf-8'));
}

// Ensure existing portals have 'type' if not present
existing = existing.map(p => ({ ...p, type: p.type || '景點' }));

const finalData = existing.concat(results);
fs.writeFileSync(portalsPath, JSON.stringify(finalData, null, 4), 'utf-8');

console.log(`Successfully added ${results.length} new POIs. Total POIs: ${finalData.length}`);
