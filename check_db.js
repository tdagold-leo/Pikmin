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
    const v2 = await database.ref('mushrooms_v2').once('value');
    console.log("mushrooms_v2 keys:", v2.val() ? Object.keys(v2.val()).length : 0);
    
    const v1 = await database.ref('mushrooms').once('value');
    console.log("mushrooms keys:", v1.val() ? Object.keys(v1.val()).length : 0);
    
    // Check if Beringer Brothers Winery is in mushrooms
    if (v1.val()) {
        for (let key in v1.val()) {
            if (v1.val()[key].name === 'Beringer Brothers Winery' || v1.val()[key].name === 'Angwin Volunteer Fire Department') {
                console.log('FOUND IN MUSHROOMS:', v1.val()[key]);
            }
        }
    }
    
    process.exit(0);
}

check();
