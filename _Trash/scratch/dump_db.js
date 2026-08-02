const firebase = require('firebase/app');
require('firebase/database');
const fs = require('fs');

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

async function dump() {
    console.log("Dumping DB...");
    const pSnapshot = await database.ref('postcards').once('value');
    fs.writeFileSync('scratch/postcards_dump.json', JSON.stringify(pSnapshot.val(), null, 2));
    
    const mSnapshot = await database.ref('mushrooms').once('value');
    fs.writeFileSync('scratch/mushrooms_dump.json', JSON.stringify(mSnapshot.val(), null, 2));

    const m2Snapshot = await database.ref('mushrooms_v2').once('value');
    fs.writeFileSync('scratch/mushrooms_v2_dump.json', JSON.stringify(m2Snapshot.val(), null, 2));
    
    console.log("Done.");
    process.exit(0);
}

dump();
