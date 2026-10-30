const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const s1 = `        // 尋找附帶的標籤/名稱字串 (例如 "37.123, 140.456 大藍")
        const tagMatch = coordsStr.match(/(-?\\d+(?:\\.\\d+)?)(?:[\\s,，]+)(-?\\d+(?:\\.\\d+)?)\\s+(.+)/);
        if (tagMatch && tagMatch[3]) {
            const extractedTag = tagMatch[3].trim();
            // 自動帶入標籤欄位
            let targetTagId = null;
            if (countryInputId === 'country') targetTagId = 'tag';
            else if (countryInputId === 'edit-mushroom-country') targetTagId = 'edit-tag';
            
            if (targetTagId) {
                const tagEl = document.getElementById(targetTagId);
                if (tagEl && !tagEl.value) { // 只有當標籤是空的時候才覆蓋
                    tagEl.value = extractedTag;
                }
            }`;

const r1 = `        // 尋找附帶的標籤/名稱字串 (例如 "37.123, 140.456 大藍")
        const tagMatch = coordsStr.match(/(-?\\d+(?:\\.\\d+)?)(?:[\\s,，]+)(-?\\d+(?:\\.\\d+)?)\\s+(.+)/);
        if (tagMatch && tagMatch[3]) {
            const extractedTag = tagMatch[3].trim();
            // 自動帶入標籤欄位
            let targetTagId = null;
            if (countryInputId === 'country') targetTagId = 'tag';
            else if (countryInputId === 'edit-mushroom-country') targetTagId = 'edit-tag';
            
            if (targetTagId) {
                const tagEl = document.getElementById(targetTagId);
                if (tagEl && !tagEl.value) { // 只有當標籤是空的時候才覆蓋
                    tagEl.value = extractedTag;
                    
                    // 自動判斷是否為元素菇
                    let isElem = false;
                    if (extractedTag.includes('水晶')) isElem = true;
                    else if (extractedTag.includes('毒')) isElem = true;
                    else if (extractedTag.includes('大冰藍') || extractedTag.includes('冰')) isElem = true;
                    else if (extractedTag.includes('水') && !extractedTag.includes('水果')) isElem = true;
                    else if (extractedTag.includes('火') || extractedTag.includes('紅')) isElem = true;
                    else if (extractedTag.includes('電')) isElem = true;
                    else if (extractedTag.includes('大藍')) isElem = true;
                    else if (extractedTag.includes('大白')) isElem = true;
                    else if (extractedTag.includes('大紫')) isElem = true;

                    if (isElem) {
                        let targetKindId = (countryInputId === 'country') ? 'mushroom-kind' : (countryInputId === 'edit-mushroom-country' ? 'edit-mushroom-kind' : null);
                        if (targetKindId) {
                            const kindEl = document.getElementById(targetKindId);
                            if (kindEl) kindEl.value = '元素菇';
                        }
                    }
                }
            }`;

const s2 = `                    const regexType = /(小|普通|大|巨大)\\s*([\\u4e00-\\u9fa5]{1,4}?)\\s*色?\\s*蘑菇/;
                    let foundType = '';
                    for (const line of lines) {
                        const match = regexType.exec(line);
                        if (match) {
                            foundType = \`\${match[1]}\${match[2]}\`;
                            break;
                        }
                    }
                    
                    if (foundType && tagField && (!tagField.value || tagField.value.trim() === '')) {
                        tagField.value = foundType;
                        autoFilled.push('標籤');
                    }`;

const r2 = `                    const regexType = /(小|普通|大|巨大)\\s*([\\u4e00-\\u9fa5]{1,4}?)\\s*色?\\s*蘑菇/;
                    let foundType = '';
                    for (const line of lines) {
                        const match = regexType.exec(line);
                        if (match) {
                            foundType = \`\${match[1]}\${match[2]}\`;
                            break;
                        }
                    }
                    
                    if (foundType && tagField && (!tagField.value || tagField.value.trim() === '')) {
                        tagField.value = foundType;
                        autoFilled.push('標籤');
                        
                        // 自動判斷是否為元素菇
                        let isElem = false;
                        if (foundType.includes('水晶')) isElem = true;
                        else if (foundType.includes('毒')) isElem = true;
                        else if (foundType.includes('大冰藍') || foundType.includes('冰')) isElem = true;
                        else if (foundType.includes('水') && !foundType.includes('水果')) isElem = true;
                        else if (foundType.includes('火') || foundType.includes('紅')) isElem = true;
                        else if (foundType.includes('電')) isElem = true;
                        else if (foundType.includes('大藍')) isElem = true;
                        else if (foundType.includes('大白')) isElem = true;
                        else if (foundType.includes('大紫')) isElem = true;

                        if (isElem) {
                            const kindField = document.getElementById('mushroom-kind');
                            if (kindField && kindField.value !== '元素菇') {
                                kindField.value = '元素菇';
                                autoFilled.push('元素菇分類');
                            }
                        }
                    }`;

function flexibleReplace(text, search, replace) {
    const normalize = str => str.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
    const searchNorm = normalize(search);
    const textNorm = normalize(text);
    if (textNorm.includes(searchNorm)) {
        const regexStr = search.trim().split(/\s+/).map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
        return text.replace(new RegExp(regexStr), replace);
    }
    return text;
}

js = flexibleReplace(js, s1, r1);
js = flexibleReplace(js, s2, r2);

fs.writeFileSync('js/main.js', js);
console.log('main.js patched');

let htmlIndex = fs.readFileSync('index.html', 'utf8');
htmlIndex = htmlIndex.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.08.2110"');
htmlIndex = htmlIndex.replace(/v=\d{10,14}/g, 'v=202610082110');
fs.writeFileSync('index.html', htmlIndex);
