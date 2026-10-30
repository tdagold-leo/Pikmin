const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/\r\n/g, '\n');

const addItemTarget = `                const sgActivityEl = document.getElementById('post-sg-activity');
                pushData.sgActivity = sgActivityEl ? sgActivityEl.value.trim() : '';`;
const addItemReplace = `                const sgActivityEl = document.getElementById('post-sg-activity');
                pushData.sgActivity = sgActivityEl ? sgActivityEl.value.trim() : '';
                const sgSubEl = document.getElementById('post-sg-sub');
                if (sgSubEl && sgSubEl.value.trim()) pushData.sgSubActivity = sgSubEl.value.trim();`;

if (js.includes(addItemTarget)) {
    js = js.replace(addItemTarget, addItemReplace);
    console.log('addItem patched');
}

const editClearTarget = `                updates.sgType = null;
                updates.sgActivity = null;`;
const editClearReplace = `                updates.sgType = null;
                updates.sgActivity = null;
                updates.sgSubActivity = null;`;
if (js.includes(editClearTarget)) {
    js = js.replace(editClearTarget, editClearReplace);
    console.log('submitDataEdit clear patched');
}

fs.writeFileSync('js/main.js', js);
