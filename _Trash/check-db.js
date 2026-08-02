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

async function run() {
    const res = await fetch(FIREBASE_URL);
    const json = await res.json();
    for (let key in json) {
        const item = decryptPayload(json[key]);
        if (item.sgActivity === 'IKEA') {
            console.log("IKEA item:", item.name, "sgCooldown:", item.sgCooldown, typeof item.sgCooldown);
        }
    }
}
run();
