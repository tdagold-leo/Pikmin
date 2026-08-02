import codecs
import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = -1
end = -1
for i, line in enumerate(lines):
    if '<script>' in line and i > 1500 and start == -1: start = i
    if '</script>' in line and i > 4000: end = i

if start != -1 and end != -1:
    js_lines = lines[start+1:end]
    html_before = lines[:start]
    html_after = lines[end+1:]
    
    js_content = ''.join(js_lines)
    
    db_init_str = 'const database = firebase.database();'
    enc_logic = '''
    // --- Security Encryption Mechanism ---
    const SECRET_KEY = "PikminTrackerSecretKey2026";
    
    function encryptPayload(data) {
        if (!data) return data;
        try {
            const jsonStr = JSON.stringify(data);
            const encrypted = CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
            return { _encrypted: encrypted };
        } catch (e) { return data; }
    }

    function decryptPayload(data) {
        if (!data || !data._encrypted) return data;
        try {
            const decryptedBytes = CryptoJS.AES.decrypt(data._encrypted, SECRET_KEY);
            const decryptedStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedStr);
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
        if (typeof obj !== 'object') return obj;
        
        let res = Array.isArray(obj) ? [] : {};
        for (let k in obj) res[k] = dbDecrypt(obj[k]);
        return res;
    }
    
    function dbRef(path) {
        const ref = database.ref(path);
        const needsEnc = path && (path.includes('mushrooms_v2') || path.includes('postcards') || path.includes('landmarks'));
        if (!needsEnc) return ref;

        const proxyRef = {
            key: ref.key,
            push: (data) => ref.push(dbEncrypt(data)),
            set: (data) => ref.set(dbEncrypt(data)),
            update: (data) => ref.update(dbEncrypt(data)),
            remove: () => ref.remove(),
            transaction: (fn) => ref.transaction(fn),
            on: (event, callback) => {
                return ref.on(event, snap => {
                    const dec = dbDecrypt(snap.val());
                    callback({ val: () => dec, key: snap.key, exists: () => snap.exists() });
                });
            },
            once: (event, callback) => {
                if (callback) {
                    return ref.once(event, snap => {
                        const dec = dbDecrypt(snap.val());
                        callback({ val: () => dec, key: snap.key, exists: () => snap.exists() });
                    });
                }
                return ref.once(event).then(snap => {
                    const dec = dbDecrypt(snap.val());
                    return { val: () => dec, key: snap.key, exists: () => snap.exists() };
                });
            }
        };
        return proxyRef;
    }
'''
    js_content = js_content.replace(db_init_str, db_init_str + '\n' + enc_logic)
    js_content = js_content.replace('database.ref(', 'dbRef(')
    
    os.makedirs('js', exist_ok=True)
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    new_html = html_before + [
        '    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>\n',
        '    <script src="js/main.min.js"></script>\n'
    ] + html_after
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_html)
    print("Success!")
else:
    print("Failed to find script tags.")
