const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// 1. togglePostcardSgFields
js = js.replace(
    /const tagContainer = document\.getElementById\(prefix \+ '-tag-container'\);([\s\S]*?)if \(tagContainer\) tagContainer\.style\.display = isSg \? 'none' : 'flex';/g,
    `const tagContainer = document.getElementById(prefix + '-tag-container');
        const subContainer = document.getElementById(prefix + '-sg-sub-container');$1if (tagContainer) tagContainer.style.display = isSg ? 'none' : 'flex';
            if (subContainer) subContainer.style.display = isSg ? 'flex' : 'none';`
);

// 2. addItem (post-sg-activity)
js = js.replace(
    /const sgActivity = document\.getElementById\('post-sg-activity'\)\.value\.trim\(\);/,
    `const sgActivity = document.getElementById('post-sg-activity').value.trim();\n        const sgSub = document.getElementById('post-sg-sub').value.trim();`
);
js = js.replace(
    /if \(sgActivity\) item\.sgActivity = sgActivity;/,
    `if (sgActivity) item.sgActivity = sgActivity;\n                if (sgSub) item.sgSubActivity = sgSub;`
);

// 3. submitDataEdit (edit-post-sg-activity)
js = js.replace(
    /const sgActivity = document\.getElementById\('edit-post-sg-activity'\)\.value\.trim\(\);/,
    `const sgActivity = document.getElementById('edit-post-sg-activity').value.trim();\n            const sgSub = document.getElementById('edit-post-sg-sub').value.trim();`
);
js = js.replace(
    /if \(sgActivity\) itemToEdit\.sgActivity = sgActivity;[\s\S]*?else delete itemToEdit\.sgActivity;/,
    `if (sgActivity) itemToEdit.sgActivity = sgActivity; else delete itemToEdit.sgActivity;
                if (sgSub) itemToEdit.sgSubActivity = sgSub; else delete itemToEdit.sgSubActivity;`
);

// 4. openEditModal
js = js.replace(
    /document\.getElementById\('edit-post-sg-activity'\)\.value = item\.sgActivity \|\| '';/,
    `document.getElementById('edit-post-sg-activity').value = item.sgActivity || '';\n                document.getElementById('edit-post-sg-sub').value = item.sgSubActivity || '';`
);

// 5. _doUpdateView logic
js = js.replace(
    /let mainAct = rawAct;\s*let subAct = '';\s*const sepMatch = rawAct\.match/,
    `let mainAct = rawAct;
                                let subAct = (item.sgSubActivity || '').trim();
                                if (!subAct) {
                                    const sepMatch = rawAct.match`
);
js = js.replace(
    /subAct = rawAct\.substring\(sepIdx \+ sepMatch\[0\]\.length\)\.trim\(\);\s*\}/,
    `subAct = rawAct.substring(sepIdx + sepMatch[0].length).trim();
                                    }
                                }`
);

js = js.replace(/v=\d{10,14}/g, 'v=202610110325');
fs.writeFileSync('js/main.js', js);
console.log('JS patch complete.');
