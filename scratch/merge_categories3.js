const fs = require('fs');
const path = require('path');

const map = {
    '剪刀': '美容院',
    '景點': '待分類'
};

const portalsPath = path.join(__dirname, '../data/portals.json');
if (fs.existsSync(portalsPath)) {
    let dataStr = fs.readFileSync(portalsPath, 'utf-8');
    let data = JSON.parse(dataStr);

    data.forEach(item => {
        if (map[item.type]) {
            item.type = map[item.type];
        }
    });
    fs.writeFileSync(portalsPath, JSON.stringify(data, null, 4), 'utf-8');
    console.log('Updated portals.json');
}

const jsContent = `
const categoryMap3 = {
    '剪刀': '美容院',
    '景點': '待分類'
};

if (!localStorage.getItem('portals_imported_v9')) {
    console.log('Will merge categories in 8 seconds...');
    setTimeout(() => {
        if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
            console.error('landmarkList or dbRef not found, cannot import!');
            return;
        }
        let updateCount = 0;
        landmarkList.forEach(item => {
            if (categoryMap3[item.type]) {
                dbRef('landmarks/' + item.id).update({ type: categoryMap3[item.type] });
                updateCount++;
            }
        });
        console.log('Successfully merged ' + updateCount + ' portals into Firebase!');
        localStorage.setItem('portals_imported_v9', 'true');
        alert('已成功為您合併並更新了 ' + updateCount + ' 個純點分類！請重新整理頁面。');
    }, 8000);
}
`;

fs.writeFileSync(path.join(__dirname, '../js/import.js'), jsContent, 'utf-8');
console.log('Created js/import.js v9 for new category merging');
