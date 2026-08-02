const fs = require('fs');
const path = require('path');

const map = {
    '美容剪刀': '美容院',
    '髮圈': '服裝店',
    '衣服飾店': '服裝店',
    '服飾店': '服裝店', // just in case
    '雪皮': '下雪',
    '遊樂園': '主題樂園',
    '比薩&義大利麵': '義式餐廳',
    '拉麵': '拉麵店',
    '飯店備品': '飯店',
    '化妝品': '化妝品商店',
    '日本神社': '神社和寺廟',
    '咖哩飯': '咖哩餐廳',
    '塔可餅': '墨西哥餐廳',
    '洗衣用品': '自助洗衣店&乾洗店',
    '洗衣店': '自助洗衣店&乾洗店',
    '泡菜辛奇': '韓國餐廳',
    '文具': '文具店'
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
const categoryMap2 = {
    '美容剪刀': '美容院',
    '髮圈': '服裝店',
    '衣服飾店': '服裝店',
    '服飾店': '服裝店',
    '雪皮': '下雪',
    '遊樂園': '主題樂園',
    '比薩&義大利麵': '義式餐廳',
    '拉麵': '拉麵店',
    '飯店備品': '飯店',
    '化妝品': '化妝品商店',
    '日本神社': '神社和寺廟',
    '咖哩飯': '咖哩餐廳',
    '塔可餅': '墨西哥餐廳',
    '洗衣用品': '自助洗衣店&乾洗店',
    '洗衣店': '自助洗衣店&乾洗店',
    '泡菜辛奇': '韓國餐廳',
    '文具': '文具店'
};

if (!localStorage.getItem('portals_imported_v8')) {
    console.log('Will merge categories in 8 seconds...');
    setTimeout(() => {
        if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
            console.error('landmarkList or dbRef not found, cannot import!');
            return;
        }
        let updateCount = 0;
        landmarkList.forEach(item => {
            if (categoryMap2[item.type]) {
                dbRef('landmarks/' + item.id).update({ type: categoryMap2[item.type] });
                updateCount++;
            }
        });
        console.log('Successfully merged ' + updateCount + ' portals into Firebase!');
        localStorage.setItem('portals_imported_v8', 'true');
        alert('已成功為您合併並更新了 ' + updateCount + ' 個純點分類！請重新整理頁面。');
    }, 8000);
}
`;

fs.writeFileSync(path.join(__dirname, '../js/import.js'), jsContent, 'utf-8');
console.log('Created js/import.js v8 for new category merging');
