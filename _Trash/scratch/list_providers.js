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

async function check() {
    try {
        const snap = await database.ref('postcards').orderByKey().limitToLast(10).once('value');
        const data = snap.val();
        console.log("Last 10 postcards:");
        for (const k in data) {
            console.log(data[k].name, data[k].provider, data[k].type);
        }
        const snap2 = await database.ref('mushrooms_v2').orderByKey().limitToLast(10).once('value');
        const data2 = snap2.val();
        console.log("Last 10 mushrooms_v2:");
        for (const k in data2) {
            console.log(data2[k].name, data2[k].user, data2[k].type);
        }
    } catch(e){
        console.error(e);
    }
    process.exit(0);
}
check();
