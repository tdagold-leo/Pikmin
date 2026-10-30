const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// 1. togglePostcardSgFields (Re-verify because my regex might have failed before, wait, the diff earlier DID show it succeeded!)
// 2. _doUpdateView (Diff earlier showed it succeeded!)
// Let's only do `addItem`, `submitDataEdit`, and `openEditModal`!

// In addItem
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

// In submitDataEdit
const editSubmitTarget = `                updates.sgActivity = document.getElementById('edit-post-sg-activity').value.trim();`;
const editSubmitReplace = `                updates.sgActivity = document.getElementById('edit-post-sg-activity').value.trim();
                const sgSubVal = document.getElementById('edit-post-sg-sub').value.trim();
                if (sgSubVal) updates.sgSubActivity = sgSubVal;
                else updates.sgSubActivity = null;`;
if (js.includes(editSubmitTarget)) {
    js = js.replace(editSubmitTarget, editSubmitReplace);
    console.log('submitDataEdit patched');
}

// And also clear sgSubActivity when not goldbasin
const editClearTarget = `                updates.sgType = null;
                updates.sgActivity = null;`;
const editClearReplace = `                updates.sgType = null;
                updates.sgActivity = null;
                updates.sgSubActivity = null;`;
if (js.includes(editClearTarget)) {
    js = js.replace(editClearTarget, editClearReplace);
    console.log('submitDataEdit clear patched');
}

// In openEditModal
const openEditTarget = `                document.getElementById('edit-post-sg-activity').value = item.sgActivity || item.tag || '';`;
const openEditReplace = `                document.getElementById('edit-post-sg-activity').value = item.sgActivity || item.tag || '';
                const subEl = document.getElementById('edit-post-sg-sub');
                if (subEl) subEl.value = item.sgSubActivity || '';`;
if (js.includes(openEditTarget)) {
    js = js.replace(openEditTarget, openEditReplace);
    console.log('openEditModal patched');
}

js = js.replace(/v=\d{10,14}/g, 'v=202610110325');
fs.writeFileSync('js/main.js', js);
console.log('Done.');
