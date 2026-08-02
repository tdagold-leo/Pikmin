const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /dbRef\('postcards'\)\.push\(pushData\);/;
const replacement = `const newRef = dbRef('postcards').push();
            const tempSgLast = pushData._tempPersonalSgLast;
            delete pushData._tempPersonalSgLast;
            if (tempSgLast !== undefined) {
                try {
                    let personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
                    personal[newRef.key] = tempSgLast;
                    localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
                } catch(e){}
            }
            newRef.set(pushData);`;

if (mainJs.match(regex)) {
    mainJs = mainJs.replace(regex, replacement);
    console.log("Successfully replaced dbRef('postcards').push");
} else {
    console.log("Failed to match regex");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
