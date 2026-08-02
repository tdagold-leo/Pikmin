const fetch = require('node-fetch');
const cryptoJS = require('crypto-js');

const SECRET_KEY = "PikminTrackerSecretKey2026";
const FIREBASE_URL = "https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/postcards";

function encryptPayload(data) {
    if (!data) return data;
    try {
        const jsonStr = JSON.stringify(data);
        const encrypted = cryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
        return { _encrypted: encrypted };
    } catch (e) { return data; }
}

function dbEncrypt(obj) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return encryptPayload(obj);
    let res = {};
    for (let k in obj) res[k] = encryptPayload(obj[k]);
    return res;
}

function decryptPayload(data) {
    if (!data || !data._encrypted) return data;
    try {
        const decryptedBytes = cryptoJS.AES.decrypt(data._encrypted, SECRET_KEY);
        const decryptedStr = decryptedBytes.toString(cryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (e) { return data; }
}

function dbDecrypt(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'object' && obj._encrypted) return decryptPayload(obj);
    if (typeof obj !== 'object') return obj;
    
    let res = Array.isArray(obj) ? [] : {};
    for (let k in obj) res[k] = dbDecrypt(obj[k]);
    return res;
}

const items = [
    { name: "IKEA 新莊店", coords: "25.03765, 121.46211" },
    { name: "IKEA 新店店", coords: "24.97531, 121.53027" },
    { name: "IKEA 內湖店", coords: "25.06170, 121.57925" },
    { name: "IKEA 台北城市店", coords: "25.05141, 121.54823" },
    { name: "IKEA 桃園店", coords: "25.01309, 121.21757" },
    { name: "IKEA 台中店", coords: "24.14647, 120.64486" },
    { name: "IKEA 高雄店", coords: "22.60375, 120.30554" },
    { name: "IKEA 嘉義城市店", coords: "23.47731, 120.43864" }
];

async function run() {
    // Fetch all postcards
    const res = await fetch(FIREBASE_URL + ".json");
    const json = await res.json();
    
    // Delete any IKEA ones that were incorrectly imported (having _encrypted at root)
    for (let key in json) {
        const rawItem = json[key];
        if (rawItem._encrypted) {
            const dec = decryptPayload(rawItem);
            if (dec && dec.sgActivity === 'IKEA') {
                console.log("Deleting incorrect record:", key);
                await fetch(`${FIREBASE_URL}/${key}.json`, { method: 'DELETE' });
            }
        } else {
            // Check correctly imported ones in case there are duplicates
            const dec = dbDecrypt(rawItem);
            if (dec && dec.sgActivity === 'IKEA') {
                console.log("Deleting duplicate/old correct record:", key);
                await fetch(`${FIREBASE_URL}/${key}.json`, { method: 'DELETE' });
            }
        }
    }
    
    // Insert new correct records
    for (let item of items) {
        const pushData = {
            type: "特殊金盆",
            country: "台灣",
            city: "",
            name: item.name,
            coords: item.coords.replace(/\s/g, ''),
            tag: "",
            image: "無圖片",
            provider: "BatchImport-Fixed",
            sgType: "期間",
            sgActivity: "IKEA",
            sgStart: "2026-08-01",
            sgEnd: "2026-08-31",
            sgCooldown: "7",
            sgLast: ""
        };
        
        // Correct dbEncrypt!
        const payload = dbEncrypt(pushData);
        
        const res2 = await fetch(FIREBASE_URL + ".json", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        const out = await res2.json();
        console.log("Imported correctly:", item.name, out);
    }
}

run();
