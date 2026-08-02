const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /const editSgLast = document\.getElementById\('edit-post-sg-last'\)\.value \|\| '';\s*\n\s*try \{\s*\n\s*let personal = JSON\.parse\(localStorage\.getItem\('pikmin_sgLast_map'\) \|\| '\{\}'\);\s*\n\s*personal\[currentEditingId\] = editSgLast;\s*\n\s*localStorage\.setItem\('pikmin_sgLast_map', JSON\.stringify\(personal\)\);\s*\n\s*if \(typeof currentSyncId !== 'undefined' && currentSyncId\) \{\s*\n\s*dbRef\('user_sg_last\/' \+ currentSyncId\)\.set\(personal\);\s*\n\s*\}\s*\n\s*\} catch\(e\)\{\}/;

const replacement = `const editSgLast = document.getElementById('edit-post-sg-last').value || '';
                    try {
                        let personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
                        personal[currentEditingTimeId] = editSgLast;
                        localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
                        if (typeof currentSyncId !== 'undefined' && currentSyncId) {
                            dbRef('user_sg_last/' + currentSyncId).set(personal);
                        }
                    } catch(e){}
                    const foundPc = (typeof postcardList !== 'undefined' ? postcardList : []).find(x => x.id === currentEditingTimeId);
                    if (foundPc) foundPc.sgLast = editSgLast;`;

if (mainJs.match(regex)) {
    mainJs = mainJs.replace(regex, replacement);
    console.log("Successfully fixed currentEditingTimeId in saveTime");
} else {
    console.log("Failed to match saveTime regex");
}

// Add updateView() right after closeModal('time-modal'); in saveTime
const closeRegex = /dbRef\('postcards\/' \+ currentEditingTimeId\)\.update\(updates\);\s*\n\s*window\._editDiscontinued = false;\s*\n\s*\}\s*\n\s*closeModal\('time-modal'\);/;
const closeReplacement = `dbRef('postcards/' + currentEditingTimeId).update(updates);
            window._editDiscontinued = false;
        }
        closeModal('time-modal');
        updateView();`;

if (mainJs.match(closeRegex)) {
    mainJs = mainJs.replace(closeRegex, closeReplacement);
    console.log("Successfully added updateView() after closeModal");
} else {
    console.log("Failed to match closeRegex");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
