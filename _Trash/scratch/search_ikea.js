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

async function search() {
    try {
        const tables = ['postcards', 'mushrooms', 'mushrooms_v2'];
        for (const table of tables) {
            const pSnapshot = await database.ref(table).once('value');
            const pData = pSnapshot.val();
            if (pData) {
                for (const key in pData) {
                    const str = JSON.stringify(pData[key]).toLowerCase();
                    if (str.includes("ikea") || str.includes("特殊")) {
                        console.log(`[${table}] ${key}:`, pData[key]);
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

search();
