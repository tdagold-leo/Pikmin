const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Add global variable for sgLastListenerRef
if (!mainJs.includes('let sgLastListenerRef = null;')) {
    mainJs = mainJs.replace(/let favoritesListenerRef = null;/, 'let favoritesListenerRef = null;\nlet sgLastListenerRef = null;');
}

// 2. Patch applySyncId
const syncRegex = /if \(favPcListenerRef\) \{ favPcListenerRef\.off\(\); favPcListenerRef = null; \}/;
const syncReplacement = `if (favPcListenerRef) { favPcListenerRef.off(); favPcListenerRef = null; }
        if (typeof sgLastListenerRef !== 'undefined' && sgLastListenerRef) { sgLastListenerRef.off(); sgLastListenerRef = null; }`;

if (mainJs.match(syncRegex)) {
    mainJs = mainJs.replace(syncRegex, syncReplacement);
}

const syncOnRegex = /favPcListenerRef\.on\('value', \(snapshot\) => \{[\s\S]*?updateView\(\);\s*\}\);/;
const syncOnReplacement = `favPcListenerRef.on('value', (snapshot) => {
                const data = snapshot.val();
                cloudPcFav = Array.isArray(data) ? data : (data ? Object.values(data) : []);
                updateView();
            });
            sgLastListenerRef = dbRef('user_sg_last/' + inputId);
            sgLastListenerRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    localStorage.setItem('pikmin_sgLast_map', JSON.stringify(data));
                    updateView();
                }
            });`;

if (mainJs.match(syncOnRegex)) {
    mainJs = mainJs.replace(syncOnRegex, syncOnReplacement);
}

// 3. Patch Add push
const addPushRegex = /personal\[newRef\.key\] = tempSgLast;\s*\n\s*localStorage\.setItem\('pikmin_sgLast_map', JSON\.stringify\(personal\)\);/;
const addPushReplacement = `personal[newRef.key] = tempSgLast;
                    localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
                    if (typeof currentSyncId !== 'undefined' && currentSyncId) {
                        dbRef('user_sg_last/' + currentSyncId).set(personal);
                    }`;

if (mainJs.match(addPushRegex)) {
    mainJs = mainJs.replace(addPushRegex, addPushReplacement);
}

// 4. Patch Edit save
const editSaveRegex = /personal\[currentEditingId\] = editSgLast;\s*\n\s*localStorage\.setItem\('pikmin_sgLast_map', JSON\.stringify\(personal\)\);/;
const editSaveReplacement = `personal[currentEditingId] = editSgLast;
                        localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
                        if (typeof currentSyncId !== 'undefined' && currentSyncId) {
                            dbRef('user_sg_last/' + currentSyncId).set(personal);
                        }`;

if (mainJs.match(editSaveRegex)) {
    mainJs = mainJs.replace(editSaveRegex, editSaveReplacement);
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
console.log("Successfully patched sync logic for sgLast");
