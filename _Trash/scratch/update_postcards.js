const https = require('https');
const fs = require('fs');

const DB_URL = "https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/postcards.json";
const API_BASE = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function putJson(url, payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const req = https.request(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => resolve(resData));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function convertToTw(text) {
    if (!text) return text;
    // Simple replacements for common ones since we don't have OpenCC in Node easily without npm install
    let t = text;
    t = t.replace(/中华民国/g, "台灣");
    t = t.replace(/中華民國/g, "台灣");
    t = t.replace(/大韩民国/g, "南韓");
    t = t.replace(/大韓民國/g, "南韓");
    t = t.replace(/台湾/g, "台灣");
    t = t.replace(/韩国/g, "韓國");
    t = t.replace(/日本国/g, "日本");
    t = t.replace(/日本國/g, "日本");
    return t;
}

async function main() {
    console.log("Fetching all postcards...");
    const postcards = await fetchJson(DB_URL);
    if (!postcards) {
        console.log("No postcards found.");
        return;
    }

    const keys = Object.keys(postcards);
    console.log(`Found ${keys.length} postcards.`);

    let updatedCount = 0;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const pc = postcards[key];
        if (!pc.coords) continue;

        const match = pc.coords.match(/(-?\d+(?:\.\d+)?)(?:[\s,]+)(-?\d+(?:\.\d+)?)/);
        if (!match) continue;

        const lat = match[1];
        const lon = match[2];

        try {
            const geo = await fetchJson(`${API_BASE}?latitude=${lat}&longitude=${lon}&localityLanguage=zh-TW`);
            if (geo && geo.countryName) {
                let countryName = geo.countryName;
                countryName = convertToTw(countryName);
                
                let city = geo.city || geo.locality || geo.principalSubdivision || "";
                city = convertToTw(city);
                
                let combined = countryName;
                if (city && !countryName.includes(city)) {
                    combined = countryName + "・" + city;
                }

                if (pc.country !== combined) {
                    console.log(`[${i+1}/${keys.length}] Updating ${key}: ${pc.country} -> ${combined}`);
                    pc.country = combined;
                    
                    // Update in DB
                    await putJson(`https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/postcards/${key}/country.json`, combined);
                    updatedCount++;
                } else {
                    console.log(`[${i+1}/${keys.length}] Skip ${key} (Already correct: ${combined})`);
                }
            }
        } catch (err) {
            console.error(`Failed to geocode ${key}:`, err.message);
        }
        
        // Sleep to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`Finished! Updated ${updatedCount} postcards.`);
}

main();
