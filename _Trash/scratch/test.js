function test() {
    const coordCount = {};
    const filterVal = '';
    const searchVal = '';
    const container = {};
    const emptyEl = {};
    const landmarkList = [];
    const escapeHtml = (s) => s;
    const normalizeCoords = (s) => s;

    let filtered = filterVal ? landmarkList.filter(i => i.type === filterVal) : [...landmarkList];

    let searchCoords = null;
    const coordMatch = searchVal.match(/(-?\d+(?:\.\d+)?)(?:[\s,]+)(-?\d+(?:\.\d+)?)/);
    if (coordMatch) {
        searchCoords = { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]) };
        filtered.forEach(item => {
            const ic = (item.coords || '').match(/(-?\d+(?:\.\d+)?)(?:[\s,]+)(-?\d+(?:\.\d+)?)/);
            item._dist = ic ? 999 : 99999;
        });
        filtered = filtered.filter(i => i._dist <= 1);
    }

    if (filtered.length === 0) {
        return;
    }

    const groups = {};
    filtered.forEach(item => {
        const key = item.type || '未分類';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });

    Object.entries(groups).forEach(([type, items]) => {
        const groupId = 'lm-grp-' + type.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
        // ...
    });
}
