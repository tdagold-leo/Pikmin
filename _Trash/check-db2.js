const fetch = require('node-fetch');

const FIREBASE_URL = "https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/postcards.json";

async function run() {
    const res = await fetch(FIREBASE_URL);
    const json = await res.json();
    let count = 0;
    for (let key in json) {
        const item = json[key];
        if (!item._encrypted && Object.keys(item).some(k => item[k] && item[k]._encrypted)) {
            console.log("Normal Item Example:", key, JSON.stringify(item).substring(0, 200) + '...');
            count++;
            if (count > 2) break;
        } else if (item._encrypted) {
            console.log("IKEA-style Item Example:", key, "Has _encrypted at root level.");
        }
    }
}
run();
