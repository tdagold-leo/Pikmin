const fs = require('fs');
const path = require('path');

const portalsPath = path.join(__dirname, '../data/portals.json');
let dataStr = fs.readFileSync(portalsPath, 'utf-8');
let data = JSON.parse(dataStr);

data.forEach(item => {
    if (item.type === '文具純點') {
        item.type = '文具';
    }
});
fs.writeFileSync(portalsPath, JSON.stringify(data, null, 4), 'utf-8');
dataStr = JSON.stringify(data);

const jsContent = `
const newPortalsData = ${dataStr};

if (!localStorage.getItem('portals_imported_v6')) {
    console.log('Will import portals in 8 seconds...');
    setTimeout(() => {
        if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
            console.error('landmarkList or dbRef not found, cannot import!');
            return;
        }
        let addCount = 0;
        let updateCount = 0;
        newPortalsData.forEach(item => {
            const normCoords = (item.lat + ',' + item.lng).toLowerCase().replace(/\\s+/g, '');
            const isDup = landmarkList.some(i => (i.coords || '').trim().toLowerCase().replace(/\\s+/g, '') === normCoords);
            if (!isDup) {
                const lmData = { type: item.type, coords: item.lat + ', ' + item.lng, note: item.name, country: '', city: '', timestamp: Date.now() };
                dbRef('landmarks').push(lmData);
                addCount++;
            } else {
                const dupItem = landmarkList.find(i => (i.coords || '').trim().toLowerCase().replace(/\\s+/g, '') === normCoords);
                if (dupItem && (dupItem.type === '文具純點' || dupItem.type === '?具純?')) {
                    dbRef('landmarks/' + dupItem.id).update({ type: '文具' });
                    updateCount++;
                }
            }
        });
        console.log('Successfully imported ' + addCount + ' portals into Firebase!');
        localStorage.setItem('portals_imported_v6', 'true');
        alert('已匯入 ' + addCount + ' 個新純點，並修正了 ' + updateCount + ' 個舊純點的分類！請重新整理頁面。');
    }, 8000);
}
`;

fs.writeFileSync(path.join(__dirname, '../js/import.js'), jsContent, 'utf-8');
console.log('Fixed portals.json and created js/import.js');
