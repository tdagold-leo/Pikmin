const firebase = require('firebase/app');
require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyBkmQhSKbiSTeHkbAnjSZTgYtGbmPySJbo",
    authDomain: "pikmin-tracker-3cf56.firebaseapp.com",
    databaseURL: "https://pikmin-tracker-3cf56-default-rtdb.firebaseio.com/",
    projectId: "pikmin-tracker-3cf56",
    storageBucket: "pikmin-tracker-3cf56.firebasestorage.app",
    messagingSenderId: "848190561510",
    appId: "1:848190561510:web:07ceb7fa8bc57a7004af27"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

async function runUpdate() {
    try {
        console.log("Checking tables...");
        const tables = ['postcards', 'mushrooms', 'mushrooms_v2'];
        const updates = {};
        let count = 0;

        for (const table of tables) {
            const pSnapshot = await database.ref(table).once('value');
            const pData = pSnapshot.val();
            if (pData) {
                for (const key in pData) {
                    const item = pData[key];
                    
                    let isIkea = JSON.stringify(item).toUpperCase().includes("IKEA") || JSON.stringify(item).includes("宜家");
                    let isSpecialGold = JSON.stringify(item).includes("特殊金盆");

                    if (isSpecialGold && isIkea) {
                        console.log(`[${table}] Updating ${key} - Name: ${item.name} | Category: ${item.category} | Current Uploader: ${item.uploader}`);
                        updates[`${table}/${key}/uploader`] = "官";
                        count++;
                    }
                }
            }
        }
        
        console.log(`Found ${count} items to update.`);
        
        if (count > 0) {
            console.log("Applying updates...");
            await database.ref().update(updates);
            console.log("Updates applied successfully!");
        }
        
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

runUpdate();
