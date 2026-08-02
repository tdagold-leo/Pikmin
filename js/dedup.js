console.log('Starting deduplication in 5 seconds...');
setTimeout(() => {
    if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
        console.error('landmarkList or dbRef not found!');
        return;
    }
    let removedCount = 0;
    const seen = new Set();
    const toRemove = [];

    // Reverse the list so we keep the newest entries (which might have autofilled countries/cities)
    // Actually, keeping the older ones might be better because they were manually verified? 
    // Wait, the new ones have the corrected categories! Let's just keep the first one we see in the current list.
    // landmarkList is usually sorted by timestamp descending, so the newest is first.
    
    landmarkList.forEach(item => {
        if (!item.coords) return;
        // Normalize coordinates to 5 decimal places for robust matching
        // e.g. "25.123456, 121.123456"
        const parts = item.coords.split(',');
        if (parts.length < 2) return;
        
        let lat = parseFloat(parts[0].trim()).toFixed(5);
        let lon = parseFloat(parts[1].trim()).toFixed(5);
        
        const normCoords = lat + ',' + lon;
        
        if (seen.has(normCoords)) {
            toRemove.push(item.id);
        } else {
            seen.add(normCoords);
        }
    });

    toRemove.forEach(id => {
        dbRef('landmarks/' + id).remove();
        removedCount++;
    });

    console.log('Removed ' + removedCount + ' duplicates.');
    if (removedCount > 0) {
        alert('太棒了！成功幫您移除了 ' + removedCount + ' 個完全重複的地點！請重新整理頁面。');
    } else {
        alert('檢查完畢！目前沒有發現任何重複的地點喔！');
    }
}, 5000);
