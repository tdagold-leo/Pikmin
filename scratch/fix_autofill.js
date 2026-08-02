const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regexCity = /const cityInput = document\.getElementById\(cityInputId\);\s+if\(cityInput\) \{\s+cityInput\.value = combined;\s+\}/;

const newCityLogic = `const cityInput = document.getElementById(cityInputId);
                                let cityAlreadyHasData = false;
                                if(cityInput) {
                                    cityAlreadyHasData = cityInput.value.trim() !== '';
                                    if(!cityAlreadyHasData) {
                                        cityInput.value = combined;
                                    }
                                }`;

if (mainJs.match(regexCity)) {
    mainJs = mainJs.replace(regexCity, newCityLogic);
    console.log("Successfully replaced cityInput logic");
} else {
    console.log("Regex didn't match for cityInput logic!");
}

const regexAppend = /if \(combined && countryInput\) \{/;
if (mainJs.match(regexAppend)) {
    mainJs = mainJs.replace(regexAppend, 'if (combined && countryInput && !countryAlreadyHasData) {');
    console.log("Successfully replaced append logic");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
