const categoryMapFix = {
    '剪刀': '美容院',
    '景點': '待分類'
};

console.log('Forcing category merge...');
setTimeout(() => {
    if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
        console.error('landmarkList or dbRef not found!');
        return;
    }
    let updateCount = 0;
    landmarkList.forEach(item => {
        if (!item.type) return;
        const t = item.type.trim();
        
        // Check exact match
        if (categoryMapFix[t]) {
            dbRef('landmarks/' + item.id).update({ type: categoryMapFix[t] });
            updateCount++;
        } 
        // Or if it includes the word but might have weird characters
        else if (t.includes('剪刀')) {
            dbRef('landmarks/' + item.id).update({ type: '美容院' });
            updateCount++;
        }
        else if (t.includes('景點')) {
            dbRef('landmarks/' + item.id).update({ type: '待分類' });
            updateCount++;
        }
    });
    console.log('Force merged ' + updateCount + ' items.');
    if (updateCount > 0) {
        alert('終於抓到了！成功強制幫您把 ' + updateCount + ' 個頑固的分類更新了！請重新整理頁面。');
    }
}, 5000); // reduced wait to 5s
