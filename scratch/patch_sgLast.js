const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. In data loading (around line 837)
const loadRegex = /sgActivity:\s*cloudData\[key\]\.sgActivity\s*\|\|\s*'',\s*\n\s*sgType:\s*cloudData\[key\]\.sgType\s*\|\|\s*'常駐',\s*\n\s*sgStart:\s*cloudData\[key\]\.sgStart\s*\|\|\s*"",\s*\n\s*sgEnd:\s*cloudData\[key\]\.sgEnd\s*\|\|\s*"",\s*\n\s*sgCooldown:\s*cloudData\[key\]\.sgCooldown\s*\|\|\s*"",\s*\n\s*sgLast:\s*cloudData\[key\]\.sgLast\s*\|\|\s*""/;

const loadReplacement = `sgActivity: cloudData[key].sgActivity || '',
                    sgType: cloudData[key].sgType || '常駐',
                    sgStart: cloudData[key].sgStart || "",
                    sgEnd: cloudData[key].sgEnd || "",
                    sgCooldown: cloudData[key].sgCooldown || "",
                    sgLast: (function(){
                        try {
                            const personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
                            if(personal[key] !== undefined) return personal[key];
                        }catch(e){}
                        return cloudData[key].sgLast || "";
                    })()`;

if (mainJs.match(loadRegex)) {
    mainJs = mainJs.replace(loadRegex, loadReplacement);
    console.log("Successfully replaced data loading for sgLast");
} else {
    console.log("Failed to match loadRegex");
}

// 2. In Add modal (around line 2146)
const addRegex = /pushData\.sgLast\s*=\s*document\.getElementById\('post-sg-last'\)\.value\s*\|\|\s*'';/;
const addReplacement = `// Do not push sgLast to Firebase, it is personal
                    const personalSgLast = document.getElementById('post-sg-last').value || '';
                    if (personalSgLast) {
                        pushData._tempPersonalSgLast = personalSgLast; // temporarily hold it
                    }`;

if (mainJs.match(addRegex)) {
    mainJs = mainJs.replace(addRegex, addReplacement);
    console.log("Successfully replaced Add modal for sgLast");
} else {
    console.log("Failed to match addRegex");
}

// And where the push happens in Add modal (around line 2169)
const pushRegex = /const newRef = dbRef\('landmarks'\)\.push\(\);\s*\n\s*newRef\.set\(pushData, \(error\) => \{/;
const pushReplacement = `const newRef = dbRef('landmarks').push();
                const tempSgLast = pushData._tempPersonalSgLast;
                delete pushData._tempPersonalSgLast;
                if (tempSgLast !== undefined) {
                    try {
                        let personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
                        personal[newRef.key] = tempSgLast;
                        localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
                    } catch(e){}
                }
                newRef.set(pushData, (error) => {`;

if (mainJs.match(pushRegex)) {
    mainJs = mainJs.replace(pushRegex, pushReplacement);
    console.log("Successfully replaced Add push for sgLast");
} else {
    console.log("Failed to match pushRegex");
}

// 3. In Edit modal saving (around line 2459)
const editRegex = /updates\.sgLast\s*=\s*document\.getElementById\('edit-post-sg-last'\)\.value\s*\|\|\s*'';/;
const editReplacement = `// Save sgLast personally
                    const editSgLast = document.getElementById('edit-post-sg-last').value || '';
                    try {
                        let personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
                        personal[currentEditingId] = editSgLast;
                        localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
                    } catch(e){}`;

if (mainJs.match(editRegex)) {
    mainJs = mainJs.replace(editRegex, editReplacement);
    console.log("Successfully replaced Edit modal saving for sgLast");
} else {
    console.log("Failed to match editRegex");
}

// Also remove the "updates.sgLast = null;" lines in other parts of Edit modal (e.g. line 2465 and 2473)
const editNullRegex1 = /updates\.sgLast\s*=\s*null;\s*\n\s*updates\.sgStart\s*=\s*null;\s*\n\s*updates\.sgEnd\s*=\s*null;/;
const editNullReplacement1 = `updates.sgStart = null;
                    updates.sgEnd = null;`;

if (mainJs.match(editNullRegex1)) {
    mainJs = mainJs.replace(editNullRegex1, editNullReplacement1);
    console.log("Successfully removed updates.sgLast = null (1)");
} else {
    console.log("Failed to match editNullRegex1");
}

const editNullRegex2 = /updates\.sgCooldown\s*=\s*null;\s*\n\s*updates\.sgLast\s*=\s*null;/;
const editNullReplacement2 = `updates.sgCooldown = null;`;

if (mainJs.match(editNullRegex2)) {
    mainJs = mainJs.replace(editNullRegex2, editNullReplacement2);
    console.log("Successfully removed updates.sgLast = null (2)");
} else {
    console.log("Failed to match editNullRegex2");
}


fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
