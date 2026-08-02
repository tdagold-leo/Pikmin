const fs = require('fs');
const path = require('path');

const map = {
    '爆米花': '電影院',
    '咖啡': '咖啡廳',
    '甜點': '甜點店',
    '畫框': '美術館',
    '飛機': '機場',
    '飛機玩具': '機場',
    '巴士公車站': '車站',
    '海邊/貝殼': '海灘',
    '貝殼': '海灘',
    '法國麵包': '麵包店'
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
const categoryMap = {
    '爆米花': '電影院',
    '咖啡': '咖啡廳',
    '甜點': '甜點店',
    '畫框': '美術館',
    '飛機': '機場',
    '飛機玩具': '機場',
    '巴士公車站': '車站',
    '海邊/貝殼': '海灘',
    '貝殼': '海灘',
    '法國麵包': '麵包店'
};

if (!localStorage.getItem('portals_imported_v7')) {
    console.log('Will merge categories in 8 seconds...');
    setTimeout(() => {
        if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
            console.error('landmarkList or dbRef not found, cannot import!');
            return;
        }
        let updateCount = 0;
        landmarkList.forEach(item => {
            if (categoryMap[item.type]) {
                dbRef('landmarks/' + item.id).update({ type: categoryMap[item.type] });
                updateCount++;
            }
        });
        console.log('Successfully merged ' + updateCount + ' portals into Firebase!');
        localStorage.setItem('portals_imported_v7', 'true');
        alert('已成功為您合併並更新了 ' + updateCount + ' 個純點分類！請重新整理頁面。');
    }, 8000);
}
`;

fs.writeFileSync(path.join(__dirname, '../js/import.js'), jsContent, 'utf-8');
console.log('Created js/import.js v7 for category merging');
