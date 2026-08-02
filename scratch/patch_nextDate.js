const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /const nextDate = new Date\(lastDate\.getTime\(\) \+ parseInt\(item\.sgCooldown, 10\) \* 86400000\);/g;
const replacement = `const nextDate = parseInt(item.sgCooldown, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(item.sgCooldown, 10) * 86400000);`;

const newMainJs = mainJs.replace(regex, replacement);

if (newMainJs !== mainJs) {
    fs.writeFileSync(mainJsPath, newMainJs, 'utf-8');
    console.log("Successfully replaced nextDate calculation logic in main.js");
} else {
    console.log("Regex did not match any occurrences.");
}
