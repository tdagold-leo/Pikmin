const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Remove trailing definitions at the end of the file if any
mainJs = mainJs.replace(/\n\s*function setTodayDate[\s\S]*?window\.setTodayDate = setTodayDate;\s*/g, '');
mainJs = mainJs.replace(/\n\s*function markPostcardClaimedToday[\s\S]*?window\.markPostcardClaimedToday = markPostcardClaimedToday;\s*/g, '');

// 2. Add markPostcardClaimedToday and setTodayDate right after togglePcFav
const togglePcFavEnd = `        dbRef('user_pc_fav/' + currentSyncId).set(updated);
    }`;

const functionsToAdd = `        dbRef('user_pc_fav/' + currentSyncId).set(updated);
    }

    function markPostcardClaimedToday(id, e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = \`\${y}-\${m}-\${d}\`;
        
        try {
            let personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
            personal[id] = todayStr;
            localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
            if (typeof currentSyncId !== 'undefined' && currentSyncId) {
                dbRef('user_sg_last/' + currentSyncId).set(personal);
            }
        } catch(err){}
        
        const foundPc = postcardList.find(x => x.id === id);
        if (foundPc) foundPc.sgLast = todayStr;
        
        updateView();
    }

    function setTodayDate(inputId) {
        const el = document.getElementById(inputId);
        if (!el) return;
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        el.value = \`\${y}-\${m}-\${d}\`;
    }`;

if (mainJs.includes(togglePcFavEnd)) {
    mainJs = mainJs.replace(togglePcFavEnd, functionsToAdd);
    console.log("Added functions inside main closure");
} else {
    console.error("togglePcFavEnd not found");
}

// 3. Ensure window exports at the window exports block
const exportAnchor = 'window.togglePcFav = togglePcFav;';
const newExports = `window.togglePcFav = togglePcFav;
window.markPostcardClaimedToday = markPostcardClaimedToday;
window.setTodayDate = setTodayDate;`;

if (mainJs.includes(exportAnchor) && !mainJs.includes('window.markPostcardClaimedToday')) {
    mainJs = mainJs.replace(exportAnchor, newExports);
    console.log("Added window exports");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
