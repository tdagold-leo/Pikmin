const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '../js/main.js');
let content = fs.readFileSync(mainPath, 'utf-8');

// Fix autoDetectCountry for landmark
content = content.replace(
    /const isDup = landmarkList\.some\(item => \(item\.coords \|\| ''\)\.trim\(\)\.toLowerCase\(\)\.replace\(\/\\s\+\/g, ''\) === normCoords\);/g,
    `const isDup = landmarkList.some(item => {
                if (typeof editingLandmarkId !== 'undefined' && editingLandmarkId === item.id) return false;
                return (item.coords || '').trim().toLowerCase().replace(/\\s+/g, '') === normCoords;
            });`
);

// Fix save for landmark
content = content.replace(
    /const isDup = landmarkList\.some\(item => \{\s*return normalizeCoords\(item\.coords \|\| ''\)\.toLowerCase\(\) === lmCoordsNorm;\s*\}\);/g,
    `const isDup = landmarkList.some(item => {
                    if (typeof editingLandmarkId !== 'undefined' && editingLandmarkId === item.id) return false;
                    return normalizeCoords(item.coords || '').toLowerCase() === lmCoordsNorm;
                });`
);

// Also fix autoDetectCountry for mushroom (if it has editingId)
content = content.replace(
    /const isDup = dataList\.some\(item => \(item\.coords \|\| ''\)\.trim\(\)\.toLowerCase\(\)\.replace\(\/\\s\+\/g, ''\) === normCoords\);/g,
    `const isDup = dataList.some(item => {
                if (typeof currentEditingId !== 'undefined' && currentEditingId === item.id) return false;
                return (item.coords || '').trim().toLowerCase().replace(/\\s+/g, '') === normCoords;
            });`
);

// Also fix save for mushroom
content = content.replace(
    /const isDup = dataList\.some\(item => \{\s*return normalizeCoords\(item\.coords \|\| ''\)\.toLowerCase\(\) === mCoordsStr;\s*\}\);/g,
    `const isDup = dataList.some(item => {
                    if (typeof currentEditingId !== 'undefined' && currentEditingId === item.id) return false;
                    return normalizeCoords(item.coords || '').toLowerCase() === mCoordsStr;
                });`
);


fs.writeFileSync(mainPath, content, 'utf-8');
console.log('Fixed isDup logic in main.js');
