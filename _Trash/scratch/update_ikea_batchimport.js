const firebase = require('firebase/app');
require('firebase/database');
const CryptoJS = require('crypto-js');

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

const SECRET_KEY = "PikminTrackerSecretKey2026";

function decryptPayload(data) {
    if (!data || !data._encrypted) return data;
    try {
        const decryptedBytes = CryptoJS.AES.decrypt(data._encrypted, SECRET_KEY);
        const decryptedStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (e) { return data; }
}

function encryptPayload(data) {
    if (data === null || data === undefined) return data;
    try {
        const jsonStr = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
        return { _encrypted: encrypted };
    } catch (e) { return data; }
}

function dbEncrypt(obj) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return encryptPayload(obj);
    let res = {};
    for (let k in obj) res[k] = encryptPayload(obj[k]);
    return res;
}

function dbDecrypt(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'object' && obj._encrypted) return decryptPayload(obj);
    if (typeof obj === 'object' && !Array.isArray(obj)) {
        let res = {};
        for (let k in obj) res[k] = dbDecrypt(obj[k]);
        return res;
    }
    return obj;
}

async function runUpdate() {
    try {
        console.log("正在搜尋需要更新的資料...");
        const tables = ['postcards', 'mushrooms', 'mushrooms_v2'];
        const updates = {};
        let count = 0;

        for (const table of tables) {
            const snapshot = await database.ref(table).once('value');
            const data = snapshot.val();
            if (data) {
                for (const key in data) {
                    const encryptedItem = data[key];
                    const item = dbDecrypt(encryptedItem);
                    
                    if (!item) continue;
                    
                    let providerStr = item.provider || item.user || "";
                    
                    let isTargetProvider = providerStr === "BatchImport-Fixed";
                    let isSpecialGold = item.type && String(item.type).includes("特殊金盆");
                    
                    let str = JSON.stringify(item).toUpperCase();
                    let isIkea = str.includes("IKEA") || str.includes("宜家");

                    if (isTargetProvider && isSpecialGold && isIkea) {
                        console.log(`[${table}] 找到符合項目: ${item.name} | 原上傳者: ${providerStr}`);
                        
                        if (item.provider !== undefined) item.provider = "官";
                        if (item.user !== undefined) item.user = "官";
                        
                        updates[`${table}/${key}`] = dbEncrypt(item);
                        count++;
                    }
                }
            }
        }
        
        console.log(`共找到 ${count} 筆資料準備更新。`);
        
        if (count > 0) {
            console.log("執行更新中...");
            await database.ref().update(updates);
            console.log("更新完成！");
        } else {
            console.log("沒有找到需要更新的資料。");
        }
    } catch (e) {
        console.error("發生錯誤:", e);
    }
    process.exit(0);
}

runUpdate();
