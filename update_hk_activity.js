const fetch = require('node-fetch');
const cryptoJS = require('crypto-js');

const SECRET_KEY = "PikminTrackerSecretKey2026";
const FIREBASE_URL = "https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/postcards.json";

function decryptPayload(data) {
    if (!data || !data._encrypted) return data;
    try {
        const decryptedBytes = cryptoJS.AES.decrypt(data._encrypted, SECRET_KEY);
        const decryptedStr = decryptedBytes.toString(cryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (e) { return data; }
}

function encryptPayload(data) {
    if (!data) return data;
    try {
        const jsonStr = JSON.stringify(data);
        const encryptedStr = cryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
        return { _encrypted: encryptedStr, updatedAt: Date.now() };
    } catch (e) { return data; }
}

async function run() {
    const res = await fetch(FIREBASE_URL);
    const json = await res.json();
    const updates = {};
    let count = 0;

    for (let key in json) {
        const item = decryptPayload(json[key]);
        if (item.sgActivity === '~07/16 限拉一次' || item.tag === '~07/16 限拉一次') {
            if (item.sgActivity === '~07/16 限拉一次') item.sgActivity = '香港電車站';
            if (item.tag === '~07/16 限拉一次') item.tag = '香港電車站';
            
            updates[key] = encryptPayload(item);
            count++;
            console.log("Found:", item.name);
        }
    }

    if (count > 0) {
        console.log(`Found ${count} items. Updating...`);
        const patchRes = await fetch("https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/postcards.json", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        console.log("Update status:", patchRes.status);
    } else {
        console.log("No items found.");
    }
}
run();
