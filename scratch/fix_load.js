const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /sgCooldown:\s*cloudData\[key\]\.sgCooldown\s*\|\|\s*"",\s*\n\s*sgLast:\s*cloudData\[key\]\.sgLast\s*\|\|\s*""/;

const replacement = `sgCooldown: cloudData[key].sgCooldown || "",
                    sgLast: (function(){
                        try {
                            const personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
                            if(personal[key] !== undefined) return personal[key];
                        }catch(e){}
                        return cloudData[key].sgLast || "";
                    })()`;

if (mainJs.match(regex)) {
    mainJs = mainJs.replace(regex, replacement);
    console.log("Successfully replaced data loading for sgLast");
} else {
    console.log("Failed to match regex for data loading");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
